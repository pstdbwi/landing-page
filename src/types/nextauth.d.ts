// nextauth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
interface IUser extends DefaultUser {
    jwtToken?: string
    phone_number?: string
    type?: 'google' | 'facebook' | 'credential'
}
declare module "next-auth" {
    interface User extends IUser { 
			corp_id?: string;
			corp_name?: string;
			corp_unit_id?: string;
			corp_unit_name?: string;
		}
    interface Session {
        id?: string
        user?: User;
    }
}
declare module "next-auth/jwt" {
    interface JWT extends IUser { }
}
