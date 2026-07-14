import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const fallbackNextAuthUrl =
    process.env.NEXT_PUBLIC_NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const fallbackPrivateKey = "-----BEGIN PRIVATE KEY-----\\nlocal\\n-----END PRIVATE KEY-----\\n";

export const env = createEnv({
    server: {
        NEXTAUTH_URL: z.string(),
        BASE_URL: z.string().url(),
        NEXTAUTH_SECRET: z.string(),
        FACEBOOK_CLIENT_ID: z.string(),
        FACEBOOK_CLIENT_SECRET: z.string(),
        FIREBASE_GOOGLE_CLIENT_ID: z.string(),
        FIREBASE_GOOGLE_SECRET_ID: z.string(),
        FIREBASE_PROJECT_ID: z.string(),
        FIREBASE_CLIENT_EMAIL: z.string(),
        FIREBASE_PRIVATE_KEY: z.string().transform((value) => value.replace(/\\n/gm, "\n")),
    },
    clientPrefix: "NEXT_",
    client: {
        NEXT_PUBLIC_NEXTAUTH_URL: z.string().optional(),
        NEXT_PUBLIC_NEXTAUTH_SECRET: z.string(),
        NEXT_PUBLIC_BASE_URL: z.string(),
        NEXT_PUBLIC_BASE_URL2: z.string(),
        NEXT_PUBLIC_BASE_URL_PAYMENT: z.string(),
        NEXT_PUBLIC_FACEBOOK_CLIENT_ID: z.string(),
        NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET: z.string(),
        NEXT_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID: z.string(),
        NEXT_PUBLIC_FIREBASE_GOOGLE_SECRET_ID: z.string(),
        NEXT_PUBLIC_BASIC_AUTH_USERNAME: z.string(),
        NEXT_PUBLIC_BASIC_AUTH_PASSWORD: z.string(),
        NEXT_PUBLIC_MICROSOFT_CLARITY: z.string(),
    },
    runtimeEnv: {
        // NOTE : this is server side envs
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.satuwakafindonesia.id",
        NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "local-development-secret",
        FACEBOOK_CLIENT_ID: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "local",
        FACEBOOK_CLIENT_SECRET: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || "local",
        FIREBASE_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID || "local",
        FIREBASE_GOOGLE_SECRET_ID: process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_SECRET_ID || "local",
        NEXTAUTH_URL: fallbackNextAuthUrl,
        FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "local",
        FIREBASE_CLIENT_EMAIL: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || "local@example.com",
        FIREBASE_PRIVATE_KEY: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || fallbackPrivateKey,

        // NOTE : this is client side envs
        NEXT_PUBLIC_NEXTAUTH_URL: fallbackNextAuthUrl,
        NEXT_PUBLIC_NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "local-development-secret",
        NEXT_PUBLIC_FACEBOOK_CLIENT_ID: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "local",
        NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || "local",
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.satuwakafindonesia.id",
        NEXT_PUBLIC_BASE_URL2: process.env.NEXT_PUBLIC_BASE_URL2 || "https://api2.satuwakafindonesia.id",
        NEXT_PUBLIC_BASE_URL_PAYMENT: process.env.NEXT_PUBLIC_BASE_URL_PAYMENT || "https://payment.satuwakafindonesia.id",
        NEXT_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID || "local",
        NEXT_PUBLIC_FIREBASE_GOOGLE_SECRET_ID: process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_SECRET_ID || "local",
        NEXT_PUBLIC_BASIC_AUTH_USERNAME: process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "local",
        NEXT_PUBLIC_BASIC_AUTH_PASSWORD: process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "local",

				// ANALYTICS
				NEXT_PUBLIC_MICROSOFT_CLARITY: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY || 'lceqo0jubw'
    },
    emptyStringAsUndefined: true,
});
