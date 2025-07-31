import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      const { redirectTo } = await r.json();
      window.location.href = redirectTo || "/";
    } else {
      setError("Invalid password.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
      <input
        type="password"
        placeholder="Enter Deecor password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2"
      />
      <button type="submit" className="w-full rounded p-2 border">Sign in</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
