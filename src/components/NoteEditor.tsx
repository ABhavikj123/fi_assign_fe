import type { Note, NotePayload } from "../types";
import { HiTrash, HiArchiveBox, HiArrowUpTray, HiCheckCircle } from "react-icons/hi2";

interface NoteEditorProps {
  activeNote: Note | null;
  draft: NotePayload;
  isBusy: boolean;
  canMutate: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  onToggleArchive: () => void;
  onShare: () => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export function NoteEditor({
  activeNote,
  draft,
  isBusy,
  canMutate,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  onToggleArchive,
  onShare
}: NoteEditorProps) {
  const isNew = !activeNote;
  const isShared = activeNote?.access === "shared";

  return (
    <form
      onSubmit={onSave}
      className="flex flex-col rounded-lg border border-slate-200 bg-white"
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {isNew ? "New Note" : "Edit Note"}
            </h2>
            {activeNote && (
              <p className="mt-1 text-xs text-slate-500">
                Updated {formatDate(activeNote.updated_at)}
              </p>
            )}
          </div>
          {activeNote?.is_archived && (
            <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Archived
            </span>
          )}
        </div>

        {isShared && (
          <div className="mt-4 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            This note is shared with you. Read-only.
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
            value={draft.title}
            onChange={(event) => onTitleChange(event.target.value)}
            disabled={!canMutate}
            maxLength={160}
            placeholder="Note title"
            required
          />
        </label>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Content
          <textarea
            className="mt-2 w-full min-h-72 resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
            value={draft.content}
            onChange={(event) => onContentChange(event.target.value)}
            disabled={!canMutate}
            maxLength={10000}
            placeholder="Note content"
            required
          />
        </label>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isBusy || !canMutate}
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <HiCheckCircle className="w-4 h-4" />
            {isBusy ? "Saving..." : isNew ? "Create" : "Save"}
          </button>

          {activeNote && !isShared && (
            <>
              <button
                type="button"
                onClick={onToggleArchive}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <HiArchiveBox className="w-4 h-4" />
                {activeNote.is_archived ? "Unarchive" : "Archive"}
              </button>

              <button
                type="button"
                onClick={onShare}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <HiArrowUpTray className="w-4 h-4" />
                Share
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
              >
                <HiTrash className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
