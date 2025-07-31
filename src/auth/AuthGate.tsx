import { useEffect, useState } from "react";
import LoginPage from "../pages/Login";

function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith("deecor_auth="));
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(hasAuthCookie());
  }, []);

  if (!authed) return <LoginPage />;
  return <>{children}</>;
}
