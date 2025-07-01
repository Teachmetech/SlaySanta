import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Join an event using join code
export const joinEvent = mutation({
    args: {
        joinCode: v.string(),
        name: v.string(),
        email: v.string(),
    },
    returns: v.id("participants"),
    handler: async (ctx, args) => {
        // Find event by join code
        const event = await ctx.db
            .query("events")
            .withIndex("by_join_code", (q) => q.eq("joinCode", args.joinCode))
            .first();

        if (!event) {
            throw new Error("Invalid join code");
        }

        // Check if user is already a participant
        const existingParticipant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", event._id).eq("email", args.email)
            )
            .first();

        if (existingParticipant) {
            throw new Error("Already joined this event");
        }

        // Add participant
        const participantId = await ctx.db.insert("participants", {
            eventId: event._id,
            name: args.name,
            email: args.email,
            status: "accepted" as const,
            isOrganizer: false,
            createdAt: new Date().toISOString(),
        });

        return participantId;
    },
});

// Get participants for an event
export const getEventParticipants = query({
    args: {
        eventId: v.id("events"),
    },
    returns: v.array(
        v.object({
            _id: v.id("participants"),
            _creationTime: v.number(),
            eventId: v.id("events"),
            name: v.string(),
            email: v.string(),
            wishlist: v.optional(v.string()),
            status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
            isOrganizer: v.boolean(),
            createdAt: v.string(),
        })
    ),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("participants")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();
    },
});

// Update participant wishlist
export const updateWishlist = mutation({
    args: {
        eventId: v.id("events"),
        email: v.string(),
        wishlist: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const participant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.email)
            )
            .first();

        if (!participant) {
            throw new Error("Participant not found");
        }

        await ctx.db.patch(participant._id, {
            wishlist: args.wishlist,
        });
    },
});

// Update participant status
export const updateStatus = mutation({
    args: {
        eventId: v.id("events"),
        email: v.string(),
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const participant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.email)
            )
            .first();

        if (!participant) {
            throw new Error("Participant not found");
        }

        await ctx.db.patch(participant._id, {
            status: args.status,
        });
    },
});

// Remove participant from event (organizer only)
export const removeParticipant = mutation({
    args: {
        eventId: v.id("events"),
        participantEmail: v.string(),
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
            throw new Error("Only the organizer can remove participants");
        }

        // Can't remove the organizer
        if (args.participantEmail === args.organizerEmail) {
            throw new Error("Cannot remove the organizer from the event");
        }

        // Find and remove participant
        const participant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.participantEmail)
            )
            .first();

        if (!participant) {
            throw new Error("Participant not found");
        }

        await ctx.db.delete(participant._id);

        // Also remove any assignments involving this participant
        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const assignment of assignments) {
            if (assignment.giverEmail === args.participantEmail ||
                assignment.receiverEmail === args.participantEmail) {
                await ctx.db.delete(assignment._id);
            }
        }
    },
});

// Get participant details by email for an event
export const getParticipantByEmail = query({
    args: {
        eventId: v.id("events"),
        email: v.string(),
    },
    returns: v.union(
        v.null(),
        v.object({
            _id: v.id("participants"),
            _creationTime: v.number(),
            eventId: v.id("events"),
            name: v.string(),
            email: v.string(),
            wishlist: v.optional(v.string()),
            status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
            isOrganizer: v.boolean(),
            createdAt: v.string(),
        })
    ),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.email)
            )
            .first();
    },
}); 