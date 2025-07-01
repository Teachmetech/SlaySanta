import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Draw Secret Santa assignments for an event
export const drawAssignments = mutation({
    args: {
        eventId: v.id("events"),
        organizerEmail: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        // Verify organizer
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can draw assignments");
        }

        if (event.isDrawn) {
            throw new Error("Assignments have already been drawn for this event");
        }

        // Get all accepted participants
        const participants = await ctx.db
            .query("participants")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .filter((q) => q.eq(q.field("status"), "accepted"))
            .collect();

        if (participants.length < 2) {
            throw new Error("Need at least 2 participants to draw assignments");
        }

        if (participants.length < 3) {
            throw new Error("Need at least 3 participants for Secret Santa to work properly");
        }

        // Create a shuffled array of receivers
        const givers = [...participants];
        const receivers = [...participants];

        // Fisher-Yates shuffle
        for (let i = receivers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
        }

        // Ensure no one gets themselves
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            let validAssignment = true;

            for (let i = 0; i < givers.length; i++) {
                if (givers[i].email === receivers[i].email) {
                    validAssignment = false;
                    break;
                }
            }

            if (validAssignment) {
                break;
            }

            // Reshuffle if assignment is invalid
            for (let i = receivers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            throw new Error("Could not generate valid assignments. Please try again.");
        }

        // Create assignments
        const now = new Date().toISOString();

        for (let i = 0; i < givers.length; i++) {
            await ctx.db.insert("assignments", {
                eventId: args.eventId,
                giverEmail: givers[i].email,
                giverName: givers[i].name,
                receiverEmail: receivers[i].email,
                receiverName: receivers[i].name,
                createdAt: now,
            });
        }

        // Mark event as drawn
        await ctx.db.patch(args.eventId, {
            isDrawn: true,
            updatedAt: now,
        });

        // Send assignment notification emails to all participants
        for (let i = 0; i < givers.length; i++) {
            // Get receiver's wishlist
            const receiverWishlist = receivers[i].wishlist;

            await ctx.scheduler.runAfter(0, internal.emails.sendAssignmentNotification, {
                giverEmail: givers[i].email,
                giverName: givers[i].name,
                receiverName: receivers[i].name,
                receiverWishlist,
                eventName: event.name,
                eventDate: event.date,
                budget: event.budget,
            });
        }
    },
});

// Get assignment for a specific participant
export const getMyAssignment = query({
    args: {
        eventId: v.id("events"),
        email: v.string(),
    },
    returns: v.union(
        v.null(),
        v.object({
            _id: v.id("assignments"),
            _creationTime: v.number(),
            eventId: v.id("events"),
            giverEmail: v.string(),
            giverName: v.string(),
            receiverEmail: v.string(),
            receiverName: v.string(),
            createdAt: v.string(),
            receiverWishlist: v.optional(v.string()),
        })
    ),
    handler: async (ctx, args) => {
        const assignment = await ctx.db
            .query("assignments")
            .withIndex("by_giver", (q) =>
                q.eq("eventId", args.eventId).eq("giverEmail", args.email)
            )
            .first();

        if (!assignment) {
            return null;
        }

        // Get receiver's wishlist
        const receiver = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", assignment.receiverEmail)
            )
            .first();

        return {
            ...assignment,
            receiverWishlist: receiver?.wishlist,
        };
    },
});

// Get all assignments for an event (organizer only)
export const getEventAssignments = query({
    args: {
        eventId: v.id("events"),
        organizerEmail: v.string(),
    },
    returns: v.array(
        v.object({
            _id: v.id("assignments"),
            _creationTime: v.number(),
            eventId: v.id("events"),
            giverEmail: v.string(),
            giverName: v.string(),
            receiverEmail: v.string(),
            receiverName: v.string(),
            createdAt: v.string(),
        })
    ),
    handler: async (ctx, args) => {
        // Verify organizer
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can view all assignments");
        }

        return await ctx.db
            .query("assignments")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();
    },
});

// Reset assignments (organizer only)
export const resetAssignments = mutation({
    args: {
        eventId: v.id("events"),
        organizerEmail: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        // Verify organizer
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can reset assignments");
        }

        // Delete all assignments for this event
        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const assignment of assignments) {
            await ctx.db.delete(assignment._id);
        }

        // Mark event as not drawn
        await ctx.db.patch(args.eventId, {
            isDrawn: false,
            updatedAt: new Date().toISOString(),
        });
    },
}); 