import { HiXMark } from "react-icons/hi2";

interface NotificationProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        type === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70"
          aria-label="Close"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
