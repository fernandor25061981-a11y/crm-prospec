import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-md border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-900">
        <h1 className="text-lg font-semibold">CRM Prospecção</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Entre com suas credenciais para continuar.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
