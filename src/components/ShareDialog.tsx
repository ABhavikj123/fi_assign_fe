import { useEffect, useRef } from "react";
import { HiXMark } from "react-icons/hi2";

interface ShareDialogProps {
  isOpen: boolean;
  isBusy: boolean;
  shareEmail: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function ShareDialog({
  isOpen,
  isBusy,
  shareEmail,
  onEmailChange,
  onSubmit,
  onClose
}: ShareDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      formRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-950">Share Note</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100 p-1 transition"
          >
            <HiXMark className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Share this note with another registered user.
        </p>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="mt-5 space-y-4"
        >
          <input
            type="email"
            placeholder="user@example.com"
            value={shareEmail}
            onChange={(event) => onEmailChange(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
            required
            autoFocus
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isBusy ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
