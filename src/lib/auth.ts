import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { env } from './env';
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import { Adapter } from 'next-auth/adapters';


export const authOptions: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await fetch(`${env.BASE_URL}/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const response = await user.json()

                if (response.status_code === 200) {
                    const user: any = jwt.decode(response.data[0].token)
                    cookies().set('user_token', response.data[0].token, {
											maxAge: 30 * 24 * 60 * 60, // 30 Days
										})
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.full_name,
                        image: user.image,
                        phone_number: user.phone_number,
                        district_id: user.district,
                        city_id: user.city,
                        province: user.province,
                        type: 'credential',
												corp_id: response?.data[0]?.corp_id,
            						corp_name: response?.data[0]?.corp_name,
            						corp_unit_id: response?.data[0]?.corp_unit_id,
            						corp_unit_name: response?.data[0]?.corp_unit_name
                    }
                }

                return null
            }
        }),
        GoogleProvider({
            clientId: env.FIREBASE_GOOGLE_CLIENT_ID,
            clientSecret: env.FIREBASE_GOOGLE_SECRET_ID,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            async profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    email: profile.email,
                    image: profile.picture,
                    type: 'google'
                }
            },
        }),
        FacebookProvider({
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            async profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture.data.url,
                    type: 'facebook'
                }
            },
        })
    ],
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY
        })
    }) as Adapter,
    callbacks: {
        async jwt({ token, user }) {
            if (token?.type === 'google') {
                const body = {
                    username: token?.email,
                    fullname: token?.name,
                    firebase_uid: token?.sub,
                    type: "google"
                }
                const user = await fetch(`${env.BASE_URL}/login-social-media`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "social-media-login-secret": "rahasiaajainimah"
                    }
                })
                const response = await user.json()
                if (response.status_code === 200) {
                    const user: any = jwt.decode(response.data[0].token);
										const { corp_id, corp_name, corp_unit_id, corp_unit_name } = response.data[0]
                    cookies().set('user_token', response.data[0].token, {
											maxAge: 30 * 24 * 60 * 60, // 30 Days
										})
                    token.id = user.id
										token.corp_id = corp_id || null,
            				token.corp_name = corp_name || null,
            				token.corp_unit_id = corp_unit_id || null,
            				token.corp_unit_name = corp_unit_name || null
                }
            }
            if (token?.type !== 'google' && token?.type !== 'credential') {
                const body = {
                    username: token?.email,
                    fullname: token?.name,
                    firebase_uid: token?.sub,
                    type: "facebook"
                }
                const user = await fetch(`${env.BASE_URL}/login-social-media`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "social-media-login-secret": "rahasiaajainimah"
                    }
                })
                const response = await user.json()
                if (response.status_code === 200) {
                    const user: any = jwt.decode(response.data[0].token)
										const { corp_id, corp_name, corp_unit_id, corp_unit_name } = response.data[0]
                    cookies().set('user_token', response.data[0].token, {
											maxAge: 30 * 24 * 60 * 60, // 30 Days
										})
                    token.id = user.id
										token.corp_id = corp_id || null,
            				token.corp_name = corp_name || null,
            				token.corp_unit_id = corp_unit_id || null,
            				token.corp_unit_name = corp_unit_name || null
                }
            }

            return { ...token, ...user }
        },
        async session({ session, token, user }) {
            if (token?.sub) session.id = token.sub
            session.user = token
            return session
        },
        async signIn({ account, profile }) {
            if (account?.provider === 'google') {
                const body = {
                    username: profile?.email,
                    fullname: profile?.name,
                    firebase_uid: profile?.sub,
                    type: "google"
                }
                const user = await fetch(`${env.BASE_URL}/login-social-media`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "social-media-login-secret": "rahasiaajainimah"
                    }
                })
                const response = await user.json()
                if (response.status_code === 200) {
                    return true
                } else {
                    return false
                }
            }
            if (account?.provider === 'facebook') {
                const body = {
                    username: profile?.email,
                    fullname: profile?.name,
                    firebase_uid: profile?.sub,
                    type: "facebook"
                }
                const user = await fetch(`${env.BASE_URL}/login-social-media`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "social-media-login-secret": "rahasiaajainimah"
                    }
                })
                const response = await user.json()
                if (response.status_code === 200) {
                    return true
                } else {
                    return false
                }
            }
            return true
        },
				async redirect({url, baseUrl}) {

					if(url.includes("fesyar")){
						return url
					}

					
					return baseUrl;
				},
    },
    session: {
        strategy: 'jwt',
				maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
		// cookies: {
		// 	sessionToken: {
		// 			name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
		// 			options: {
		// 					httpOnly: true,
		// 					sameSite: 'lax',
		// 					path: '/',
		// 					secure: useSecureCookies,
		// 					domain: hostName == 'localhost' ? hostName : '.' + rootDomain // add a . in front so that subdomains are included
		// 			}
		// 	},
		// },
    pages: {
        signIn: '/login',
        error: '/error'
    },
};