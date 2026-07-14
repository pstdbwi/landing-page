import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export default function withAuth(
    middleware: NextMiddleware,
    rquireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname = req.nextUrl.pathname
        if (rquireAuth.includes(pathname)) {
            const token = await getToken({
                req,
                secret: env.NEXTAUTH_SECRET
            })
            if (token) {
                const url = new URL('/', req.url)
                return NextResponse.redirect(url)
            }
        }
        return middleware(req, next)
    }
}