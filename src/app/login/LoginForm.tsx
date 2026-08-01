"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const inputClassName =
  "w-full rounded-md border border-black/[.08] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.145]";
const labelClassName = "mb-1 block text-xs text-zinc-500 dark:text-zinc-400";

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

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
