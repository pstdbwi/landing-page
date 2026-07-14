import { Suspense } from "react";
import User from "./User";


export default function UserPage(){
	return <Suspense>
						<User />
					</Suspense>
}