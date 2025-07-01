import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    events: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        date: v.string(), // ISO date string
        budget: v.optional(v.number()),
        organizerName: v.string(),
        organizerEmail: v.string(),
        joinCode: v.string(),
        isDrawn: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    })
        .index("by_join_code", ["joinCode"]),

    participants: defineTable({
        eventId: v.id("events"),
        name: v.string(),
        email: v.string(),
        wishlist: v.optional(v.string()),
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
        isOrganizer: v.boolean(),
        createdAt: v.string(),
    })
        .index("by_event", ["eventId"])
        .index("by_event_and_email", ["eventId", "email"])
        .index("by_email", ["email"]),

    assignments: defineTable({
        eventId: v.id("events"),
        giverEmail: v.string(),
        giverName: v.string(),
        receiverEmail: v.string(),
        receiverName: v.string(),
        createdAt: v.string(),
    })
        .index("by_event", ["eventId"])
        .index("by_giver", ["eventId", "giverEmail"]),

    messages: defineTable({
        eventId: v.id("events"),
        senderName: v.string(),
        senderEmail: v.string(),
        content: v.string(),
        createdAt: v.string(),
    })
        .index("by_event", ["eventId"]),
}); 