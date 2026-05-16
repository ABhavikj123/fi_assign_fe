import { HiArrowRightOnRectangle, HiQuestionMarkCircle } from "react-icons/hi2";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onAboutClick?: () => void;
}

export function Navbar({ isLoggedIn, onLogout, onAboutClick }: NavbarProps) {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-slate-950">Notes</h1>
        
        <div className="flex items-center gap-3">
          {isLoggedIn && onAboutClick && (
            <button
              onClick={onAboutClick}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              title="About API"
            >
              <HiQuestionMarkCircle className="w-5 h-5" />
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
