import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Send a message to an event
export const sendMessage = mutation({
    args: {
        eventId: v.id("events"),
        senderName: v.string(),
        senderEmail: v.string(),
        content: v.string(),
    },
    returns: v.id("messages"),
    handler: async (ctx, args) => {
        // Verify that sender is a participant in the event
        const participant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.senderEmail)
            )
            .first();

        if (!participant) {
            throw new Error("Only participants can send messages to this event");
        }

        if (participant.status !== "accepted") {
            throw new Error("Only accepted participants can send messages");
        }

        return await ctx.db.insert("messages", {
            eventId: args.eventId,
            senderName: args.senderName,
            senderEmail: args.senderEmail,
            content: args.content,
            createdAt: new Date().toISOString(),
        });
    },
});

// Get messages for an event
export const getEventMessages = query({
    args: {
        eventId: v.id("events"),
        requestorEmail: v.string(),
    },
    returns: v.array(
        v.object({
            _id: v.id("messages"),
            _creationTime: v.number(),
            eventId: v.id("events"),
            senderName: v.string(),
            senderEmail: v.string(),
            content: v.string(),
            createdAt: v.string(),
        })
    ),
    handler: async (ctx, args) => {
        // Verify that requestor is a participant in the event
        const participant = await ctx.db
            .query("participants")
            .withIndex("by_event_and_email", (q) =>
                q.eq("eventId", args.eventId).eq("email", args.requestorEmail)
            )
            .first();

        if (!participant) {
            throw new Error("Only participants can view messages for this event");
        }

        return await ctx.db
            .query("messages")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .order("desc")
            .collect();
    },
});

// Delete a message (sender or organizer only)
export const deleteMessage = mutation({
    args: {
        messageId: v.id("messages"),
        requestorEmail: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        // Get event to check if requestor is organizer
        const event = await ctx.db.get(message.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        const isOrganizer = event.organizerEmail === args.requestorEmail;
        const isSender = message.senderEmail === args.requestorEmail;

        if (!isOrganizer && !isSender) {
            throw new Error("Only the sender or organizer can delete this message");
        }

        await ctx.db.delete(args.messageId);
    },
});

