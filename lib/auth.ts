import { betterAuth } from "better-auth";
import { pool } from "./prisma";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: plug in a real email provider (Resend, Nodemailer, etc).
      // Wiring the flow now so the UI is fully functional; swap this
      // console.log for an actual send once a provider is configured.
      console.log(`[auth] Password reset requested for ${user.email}: ${url}`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
      },
    },
  },
});

