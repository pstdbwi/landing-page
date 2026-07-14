import { Suspense } from "react";
import UserUnit from "./user-unit";

export default function UserPage() {
  return (
    <Suspense>
      <UserUnit />
    </Suspense>
  );
}
