import type { Note } from "../types";
import { HiPlus, HiMagnifyingGlass } from "react-icons/hi2";

interface NotesListProps {
  notes: Note[];
  activeNoteId: string | null;
  isLoading: boolean;
  searchQuery: string;
  showArchived: boolean;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onArchivedToggle: (show: boolean) => void;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export function NotesList({
  notes,
  activeNoteId,
  isLoading,
  searchQuery,
  showArchived,
  onSearchChange,
  onSearch,
  onArchivedToggle,
  onNoteSelect,
  onNewNote
}: NotesListProps) {
  return (
    <aside className="flex flex-col rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-950">Notes</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {notes.length}
          </span>
        </div>

        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
            placeholder="Search notes"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch();
            }}
          />
          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            className="rounded-md border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <HiMagnifyingGlass className="w-4 h-4" />
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer transition hover:text-slate-900">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(event) => onArchivedToggle(event.target.checked)}
            className="rounded cursor-pointer"
          />
          <span>Archived</span>
        </label>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-0 divide-y divide-slate-200">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : notes.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              No notes yet
            </div>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => onNoteSelect(note)}
                className={`w-full border-l-2 px-4 py-3 text-left transition ${
                  activeNoteId === note.id
                    ? "border-l-slate-950 bg-slate-50"
                    : "border-l-transparent hover:bg-slate-50"
                }`}
              >
                <h3 className="line-clamp-1 text-sm font-medium text-slate-950">
                  {note.title || "Untitled"}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                  {note.content || "No content"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {formatDate(note.updated_at)}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    {note.is_archived && (
                      <span className="rounded px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                        Archived
                      </span>
                    )}
                    {note.access === "shared" && (
                      <span className="rounded px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                        Shared
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={onNewNote}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <HiPlus className="w-4 h-4" />
          New
        </button>
      </div>
    </aside>
  );
}
