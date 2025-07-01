import { components, internal } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

// Initialize Resend with production mode enabled
export const resend: Resend = new Resend(components.resend, {
    testMode: false, // Set to false for production use
});

// Send event invitation email
export const sendEventInvitation = internalMutation({
    args: {
        recipientEmail: v.string(),
        recipientName: v.optional(v.string()),
        eventName: v.string(),
        organizerName: v.string(),
        joinCode: v.string(),
        eventDate: v.string(),
        eventDescription: v.optional(v.string()),
        budget: v.optional(v.float64()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const appUrl = "https://your-app.com"; // TODO: Replace with your actual app URL
        const joinUrl = `${appUrl}?code=${args.joinCode}`;

        const budgetText = args.budget ? `Budget: $${args.budget}` : "";
        const descriptionText = args.eventDescription ? `\n\nEvent Description:\n${args.eventDescription}` : "";

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">🎅 SlaySanta</h1>
                    <h2 style="color: #16a34a; margin: 10px 0;">You're Invited to a Secret Santa!</h2>
                </div>
                
                <div style="background: #f8fafc; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 15px 0; color: #374151;">Event: ${args.eventName}</h3>
                    <p style="margin: 5px 0; color: #6b7280;"><strong>Organizer:</strong> ${args.organizerName}</p>
                    <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> ${args.eventDate}</p>
                    ${args.budget ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Budget:</strong> $${args.budget}</p>` : ""}
                    ${args.eventDescription ? `<p style="margin: 15px 0 5px 0; color: #6b7280;"><strong>Description:</strong></p><p style="margin: 0; color: #6b7280;">${args.eventDescription}</p>` : ""}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your Join Code:</p>
                        <p style="font-family: monospace; font-size: 24px; font-weight: bold; color: #dc2626; margin: 0; letter-spacing: 2px;">${args.joinCode}</p>
                    </div>
                    
                    <a href="${joinUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
                        🎁 Join Secret Santa
                    </a>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #9ca3af; font-size: 14px;">
                    <p>You can also join manually by visiting the app and entering code: <strong>${args.joinCode}</strong></p>
                    <p>Ho ho ho! 🎄</p>
                </div>
            </div>
        `;

        const plainTextContent = `
🎅 SlaySanta - You're Invited to a Secret Santa!

Event: ${args.eventName}
Organizer: ${args.organizerName}
Date: ${args.eventDate}
${budgetText}${descriptionText}

Your Join Code: ${args.joinCode}

Join here: ${joinUrl}

Or visit the app and enter code: ${args.joinCode}

Ho ho ho! 🎄
        `;

        await resend.sendEmail(
            ctx,
            `SlaySanta <noreply@info.slaysanta.com>`, // TODO: Replace with your verified domain
            args.recipientEmail,
            `🎅 You're invited to "${args.eventName}" Secret Santa!`,
            htmlContent,
            plainTextContent
        );
    },
});

// Send assignment notification email
export const sendAssignmentNotification = internalMutation({
    args: {
        giverEmail: v.string(),
        giverName: v.string(),
        receiverName: v.string(),
        receiverWishlist: v.optional(v.string()),
        eventName: v.string(),
        eventDate: v.string(),
        budget: v.optional(v.float64()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const budgetText = args.budget ? ` with a budget of $${args.budget}` : "";
        const wishlistSection = args.receiverWishlist
            ? `
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">🎁 ${args.receiverName}'s Wishlist:</h4>
                    <p style="margin: 0; color: #075985; font-style: italic;">${args.receiverWishlist}</p>
                </div>
            `
            : `
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;">💡 ${args.receiverName} hasn't set a wishlist yet. You might want to ask them for gift ideas!</p>
                </div>
            `;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">🎅 SlaySanta</h1>
                    <h2 style="color: #16a34a; margin: 10px 0;">🎯 Your Secret Santa Assignment!</h2>
                </div>
                
                <div style="background: #f8fafc; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 15px 0; color: #374151;">Event: ${args.eventName}</h3>
                    <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> ${args.eventDate}</p>
                    ${args.budget ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Budget:</strong> $${args.budget}</p>` : ""}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #fee2e2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your Secret Santa assignment:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #dc2626; margin: 0;">🎁 ${args.receiverName}</p>
                    </div>
                </div>
                
                ${wishlistSection}
                
                <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h4 style="margin: 0 0 10px 0; color: #065f46;">💝 Gift Ideas:</h4>
                    <ul style="margin: 0; color: #047857; padding-left: 20px;">
                        <li>Consider their interests and hobbies</li>
                        <li>Think about practical items they might need</li>
                        <li>Gift cards are always appreciated</li>
                        <li>Homemade gifts can be very meaningful</li>
                        ${args.budget ? `<li>Remember to stay within the $${args.budget} budget</li>` : ""}
                    </ul>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #9ca3af; font-size: 14px;">
                    <p>🤫 Remember, it's a SECRET! Don't spoil the surprise!</p>
                    <p>Happy gift hunting! 🎄</p>
                </div>
            </div>
        `;

        const plainTextContent = `
🎅 SlaySanta - Your Secret Santa Assignment!

Event: ${args.eventName}
Date: ${args.eventDate}
${budgetText}

🎁 Your Secret Santa assignment: ${args.receiverName}

${args.receiverWishlist ? `🎁 ${args.receiverName}'s Wishlist:\n${args.receiverWishlist}` : `💡 ${args.receiverName} hasn't set a wishlist yet. You might want to ask them for gift ideas!`}

💝 Gift Ideas:
• Consider their interests and hobbies
• Think about practical items they might need  
• Gift cards are always appreciated
• Homemade gifts can be very meaningful
${args.budget ? `• Remember to stay within the $${args.budget} budget` : ""}

🤫 Remember, it's a SECRET! Don't spoil the surprise!
Happy gift hunting! 🎄
        `;

        await resend.sendEmail(
            ctx,
            `SlaySanta <noreply@info.slaysanta.com>`, // TODO: Replace with your verified domain
            args.giverEmail,
            `🎯 Your Secret Santa assignment for "${args.eventName}"`,
            htmlContent,
            plainTextContent
        );
    },
});

// Send bulk email invitations (for organizers)
export const sendBulkInvitations = mutation({
    args: {
        eventId: v.id("events"),
        organizerEmail: v.string(),
        inviteEmails: v.array(v.string()),
    },
    returns: v.object({
        sent: v.number(),
        failed: v.array(v.string()),
    }),
    handler: async (ctx, args) => {
        // Verify organizer
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        if (event.organizerEmail !== args.organizerEmail) {
            throw new Error("Only the organizer can send invitations");
        }

        let sent = 0;
        const failed: string[] = [];

        // Send invitation emails
        for (const email of args.inviteEmails) {
            try {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    failed.push(email);
                    continue;
                }

                // Check if already a participant
                const existingParticipant = await ctx.db
                    .query("participants")
                    .withIndex("by_event_and_email", (q) =>
                        q.eq("eventId", args.eventId).eq("email", email)
                    )
                    .first();

                if (existingParticipant) {
                    failed.push(email);
                    continue;
                }

                await ctx.scheduler.runAfter(0, internal.emails.sendEventInvitation, {
                    recipientEmail: email,
                    eventName: event.name,
                    organizerName: event.organizerName,
                    joinCode: event.joinCode,
                    eventDate: event.date,
                    eventDescription: event.description,
                    budget: event.budget,
                });

                sent++;
            } catch (error) {
                console.error(`Failed to send invitation to ${email}:`, error);
                failed.push(email);
            }
        }

        return { sent, failed };
    },
}); 