import type { Id } from "../../convex/_generated/dataModel";

export interface User {
    id: string;
    email: string;
    name: string;
    preferences?: {
        emailNotifications: boolean;
        theme: "light" | "dark" | "system";
    };
}

export interface Event {
    _id: Id<"events">;
    name: string;
    description?: string;
    date: string;
    budget?: number;
    organizerId: string;
    joinCode: string;
    isDrawn: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Participant {
    _id: Id<"participants">;
    eventId: Id<"events">;
    userId: string;
    name: string;
    email: string;
    wishlist?: string;
    status: "pending" | "accepted" | "declined";
    createdAt: string;
}

export interface Assignment {
    _id: Id<"assignments">;
    eventId: Id<"events">;
    giverId: string;
    receiverId: string;
    createdAt: string;
}

export interface Message {
    _id: Id<"messages">;
    eventId: Id<"events">;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export interface EventWithParticipants extends Event {
    participants: Participant[];
}

export interface AssignmentWithDetails extends Assignment {
    receiver?: Participant;
    giver?: Participant;
}

export interface UserAssignment extends Assignment {
    receiver?: Participant;
} 