import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { resend } from "./emails";

const http = httpRouter();

// Resend webhook endpoint for email delivery tracking
http.route({
    path: "/resend-webhook",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        return await resend.handleResendEventWebhook(ctx, req);
    }),
});

export default http; 