import { useEffect, useRef } from "react";
import type { AboutResponse } from "../types";
import { HiXMark } from "react-icons/hi2";

interface AboutModalProps {
  isOpen: boolean;
  about: AboutResponse | null;
  onClose: () => void;
  isLoading?: boolean;
}

export function AboutModal({
  isOpen,
  about,
  onClose,
  isLoading = false
}: AboutModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition"
        onClick={onClose}
      />

      <div
        ref={contentRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-950">About API</h2>
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100 p-1 transition"
          >
            <HiXMark className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-center text-sm text-slate-500">Loading...</p>
          ) : about ? (
            <>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{about.name}</span> · {about.email}
              </p>
              <div className="mt-6 space-y-4">
                {Object.entries(about["my features"]).map(([name, description]) => (
                  <div key={name}>
                    <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">About endpoint unavailable.</p>
          )}
        </div>
      </div>
    </>
  );
}
