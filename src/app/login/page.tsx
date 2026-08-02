import { CARD } from "@/lib/ui";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className={`w-full max-w-sm p-6 ${CARD}`}>
        <h1 className="text-lg font-semibold">CRM Prospecção</h1>
        <p className="mt-1 text-sm text-muted">
          Entre com suas credenciais para continuar.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
