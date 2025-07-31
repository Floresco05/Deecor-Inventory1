import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Deecor Inventory Portal</h1>
        <LoginForm />
      </div>
    </main>
  );
}
