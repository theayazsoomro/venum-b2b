import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function LoginPagePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
