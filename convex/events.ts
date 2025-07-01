import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a unique join code
function generateJoinCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create a new Secret Santa event
export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        date: v.string(),
        budget: v.optional(v.number()),
        organizerName: v.string(),
        organizerEmail: v.string(),
    },
    returns: v.object({
        eventId: v.id("events"),
        joinCode: v.string(),
    }),
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // Generate unique join code
        let joinCode: string;
        let isUnique = false;

        while (!isUnique) {
            joinCode = generateJoinCode();
            const existing = await ctx.db
                .query("events")
                .withIndex("by_join_code", (q) => q.eq("joinCode", joinCode))
                .first();
            if (!existing) {
                isUnique = true;
            }
        }

        // Create the event
        const eventId = await ctx.db.insert("events", {
            name: args.name,
            description: args.description,
            date: args.date,
            budget: args.budget,
            organizerName: args.organizerName,
            organizerEmail: args.organizerEmail,
            joinCode: joinCode!,
            isDrawn: false,
            createdAt: now,
            updatedAt: now,
        });

        // Add organizer as first participant
        await ctx.db.insert("participants", {
            eventId,
            name: args.organizerName,
            email: args.organizerEmail,
            status: "accepted" as const,
            isOrganizer: true,
            createdAt: now,
        });

        return { eventId, joinCode: joinCode! };
    },
});

// Get event by join code
export const getByJoinCode = query({
    args: {
        joinCode: v.string(),
    },
    returns: v.union(
        v.null(),
        v.object({
            _id: v.id("events"),
            _creationTime: v.number(),
            name: v.string(),
            description: v.optional(v.string()),
            date: v.string(),
            budget: v.optional(v.number()),
            organizerName: v.string(),
            organizerEmail: v.string(),
            joinCode: v.string(),
            isDrawn: v.boolean(),
            createdAt: v.string(),
            updatedAt: v.string(),
        })
    ),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("events")
            .withIndex("by_join_code", (q) => q.eq("joinCode", args.joinCode))
            .first();
    },
});

// Get event details with participants
export const getEventDetails = query({
    args: {
        eventId: v.id("events"),
    },
    returns: v.union(
        v.null(),
        v.object({
            event: v.object({
                _id: v.id("events"),
                _creationTime: v.number(),
                name: v.string(),
                description: v.optional(v.string()),
                date: v.string(),
                budget: v.optional(v.number()),
                organizerName: v.string(),
                organizerEmail: v.string(),
                joinCode: v.string(),
                isDrawn: v.boolean(),
                createdAt: v.string(),
                updatedAt: v.string(),
            }),
            participants: v.array(
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
            participantCount: v.number(),
        })
    ),
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) return null;

        const participants = await ctx.db
            .query("participants")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        return {
            event,
            participants,
            participantCount: participants.filter(p => p.status === "accepted").length,
        };
    },
});

// Update event
export const update = mutation({
    args: {
        eventId: v.id("events"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        date: v.optional(v.string()),
        budget: v.optional(v.number()),
        organizerEmail: v.string(), // To verify organizer
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // Verify organizer
        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can update this event");
        }

        const updates: any = {
            updatedAt: new Date().toISOString(),
        };

        if (args.name !== undefined) updates.name = args.name;
        if (args.description !== undefined) updates.description = args.description;
        if (args.date !== undefined) updates.date = args.date;
        if (args.budget !== undefined) updates.budget = args.budget;

        await ctx.db.patch(args.eventId, updates);
    },
});

// Delete event
export const deleteEvent = mutation({
    args: {
        eventId: v.id("events"),
        organizerEmail: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // Verify organizer
        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can delete this event");
        }

        // Delete related data
        const participants = await ctx.db
            .query("participants")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const participant of participants) {
            await ctx.db.delete(participant._id);
        }

        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const assignment of assignments) {
            await ctx.db.delete(assignment._id);
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        // Delete the event
        await ctx.db.delete(args.eventId);
    },
});

// Get all events where user is a participant
export const getMyEvents = query({
    args: {
        email: v.string(),
    },
    returns: v.array(
        v.object({
            _id: v.id("events"),
            _creationTime: v.number(),
            name: v.string(),
            description: v.optional(v.string()),
            date: v.string(),
            budget: v.optional(v.number()),
            organizerName: v.string(),
            organizerEmail: v.string(),
            joinCode: v.string(),
            isDrawn: v.boolean(),
            createdAt: v.string(),
            updatedAt: v.string(),
            isOrganizer: v.boolean(),
            participantCount: v.number(),
        })
    ),
    handler: async (ctx, args) => {
        // Get all participants records for this user
        const participantRecords = await ctx.db
            .query("participants")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .filter((q) => q.eq(q.field("status"), "accepted"))
            .collect();

        const events = [];

        // For each participant record, get the event details
        for (const participant of participantRecords) {
            const event = await ctx.db.get(participant.eventId);
            if (event) {
                // Get participant count for this event
                const allParticipants = await ctx.db
                    .query("participants")
                    .withIndex("by_event", (q) => q.eq("eventId", event._id))
                    .filter((q) => q.eq(q.field("status"), "accepted"))
                    .collect();

                events.push({
                    ...event,
                    isOrganizer: participant.isOrganizer,
                    participantCount: allParticipants.length,
                });
            }
        }

        // Sort by creation time (newest first)
        return events.sort((a, b) => b._creationTime - a._creationTime);
    },
}); 