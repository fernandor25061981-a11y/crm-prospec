"use client";

import { useActionState } from "react";
import { BTN_PRIMARY, INPUT } from "@/lib/ui";
import { login, type LoginState } from "./actions";

const inputClassName = INPUT;
const labelClassName = "mb-1 block text-xs text-faint";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="username" className={labelClassName}>
          Usuário
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoFocus
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClassName}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={inputClassName}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className={`mt-2 ${BTN_PRIMARY}`}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
