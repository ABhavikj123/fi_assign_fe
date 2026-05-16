import type { AuthMode } from "../types";

interface AuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  isBusy: boolean;
  onModeChange: (mode: AuthMode) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AuthForm({
  mode,
  email,
  password,
  isBusy,
  onModeChange,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="mb-6 flex rounded-md border border-slate-200 bg-slate-50 p-1">
        {(["login", "register"] as AuthMode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onModeChange(item)}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition ${
              mode === item
                ? "bg-white text-slate-950"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Password
        <input
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
        />
      </label>

      <button
        type="submit"
        disabled={isBusy}
        className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {isBusy ? "Waiting..." : mode === "login" ? "Sign In" : "Register"}
      </button>
    </form>
  );
}
