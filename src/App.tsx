import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "./api";
import type { AboutResponse, AuthMode, Note, NotePayload } from "./types";
import {
  Navbar,
  Footer,
  AuthForm,
  Notification,
  NotesList,
  NoteEditor,
  ShareDialog,
  AboutModal
} from "./components";

const TOKEN_KEY = "notes_access_token";

const emptyNote: NotePayload = {
  title: "",
  content: ""
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    const firstValidationError = error.payload?.errors?.[0]?.message;
    return firstValidationError || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NotePayload>(emptyNote);
  const [shareEmail, setShareEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [about, setAbout] = useState<AboutResponse | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) ?? null,
    [activeNoteId, notes]
  );

  const canMutateActiveNote = !activeNote || activeNote.access !== "shared";

  const resetMessages = () => {
    setError("");
    setNotice("");
  };

  const loadAbout = useCallback(async () => {
    try {
      setAbout(await api.about());
    } catch {
      setAbout(null);
    }
  }, []);

  const loadNotes = useCallback(async () => {
    if (!token) return;

    setIsLoadingNotes(true);
    try {
      const result = searchQuery.trim()
        ? await api.searchNotes(token, searchQuery.trim(), showArchived)
        : await api.listNotes(token, showArchived);
      setNotes(result);
      if (activeNoteId && !result.some((note) => note.id === activeNoteId)) {
        setActiveNoteId(null);
        setDraft(emptyNote);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingNotes(false);
    }
  }, [activeNoteId, searchQuery, showArchived, token]);

  useEffect(() => {
    loadAbout();
  }, [loadAbout]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const persistToken = (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setNotes([]);
    setActiveNoteId(null);
    setDraft(emptyNote);
    setShareEmail("");
    setNotice("Logged out");
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsBusy(true);

    try {
      if (mode === "register") {
        await api.register(email, password);
        setNotice("Account created. You can log in now.");
        setMode("login");
        setEmail("");
        setPassword("");
        return;
      }

      const result = await api.login(email, password);
      persistToken(result.access_token);
      setPassword("");
      setEmail("");
      setNotice("Logged in successfully");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const selectNote = (note: Note) => {
    resetMessages();
    setActiveNoteId(note.id);
    setDraft({
      title: note.title,
      content: note.content
    });
    setShareEmail("");
    setIsShareDialogOpen(false);
  };

  const startNewNote = () => {
    resetMessages();
    setActiveNoteId(null);
    setDraft(emptyNote);
    setShareEmail("");
    setIsShareDialogOpen(false);
  };

  const saveNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !canMutateActiveNote) return;

    resetMessages();
    setIsBusy(true);

    try {
      const savedNote =
        activeNote && activeNote.access !== "shared"
          ? await api.updateNote(token, activeNote.id, draft)
          : await api.createNote(token, draft);
      setNotice(activeNote ? "Note updated successfully" : "Note created successfully");
      setActiveNoteId(savedNote.id);
      await loadNotes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const deleteActiveNote = async () => {
    if (!token || !activeNote || activeNote.access === "shared") return;

    resetMessages();
    setIsBusy(true);

    try {
      await api.deleteNote(token, activeNote.id);
      setNotice("Note deleted");
      startNewNote();
      await loadNotes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const toggleArchive = async () => {
    if (!token || !activeNote) return;

    resetMessages();
    setIsBusy(true);

    try {
      const updatedNote = activeNote.is_archived
        ? await api.unarchiveNote(token, activeNote.id)
        : await api.archiveNote(token, activeNote.id);
      setNotice(updatedNote.is_archived ? "Note archived" : "Note unarchived");
      setActiveNoteId(null);
      setDraft(emptyNote);
      await loadNotes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const shareActiveNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !activeNote || activeNote.access === "shared") return;

    resetMessages();
    setIsBusy(true);

    try {
      await api.shareNote(token, activeNote.id, shareEmail);
      setShareEmail("");
      setIsShareDialogOpen(false);
      setNotice("Note shared successfully");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar 
        isLoggedIn={!!token} 
        onLogout={logout}
        onAboutClick={() => setIsAboutModalOpen(true)}
      />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Notifications */}
          {(error || notice) && (
            <div className="mb-6">
              <Notification
                message={error || notice}
                type={error ? "error" : "success"}
                onClose={resetMessages}
              />
            </div>
          )}

          {/* Auth View */}
          {!token ? (
            <div className="mx-auto max-w-sm">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold text-slate-950">
                  Notes
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Keep your notes organized and secure
                </p>
              </div>
              <AuthForm
                mode={mode}
                email={email}
                password={password}
                isBusy={isBusy}
                onModeChange={(newMode) => {
                  resetMessages();
                  setMode(newMode);
                }}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleAuth}
              />
            </div>
          ) : (
            /* App View */
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              {/* Notes List Sidebar */}
              <NotesList
                notes={notes}
                activeNoteId={activeNoteId}
                isLoading={isLoadingNotes}
                searchQuery={searchQuery}
                showArchived={showArchived}
                onSearchChange={setSearchQuery}
                onSearch={loadNotes}
                onArchivedToggle={setShowArchived}
                onNoteSelect={selectNote}
                onNewNote={startNewNote}
              />

              {/* Note Editor - Always shown */}
              <NoteEditor
                activeNote={activeNote}
                draft={draft}
                isBusy={isBusy}
                canMutate={canMutateActiveNote}
                onTitleChange={(title) =>
                  setDraft((current) => ({
                    ...current,
                    title
                  }))
                }
                onContentChange={(content) =>
                  setDraft((current) => ({
                    ...current,
                    content
                  }))
                }
                onSave={saveNote}
                onDelete={deleteActiveNote}
                onToggleArchive={toggleArchive}
                onShare={() => setIsShareDialogOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        isBusy={isBusy}
        shareEmail={shareEmail}
        onEmailChange={setShareEmail}
        onSubmit={shareActiveNote}
        onClose={() => {
          setIsShareDialogOpen(false);
          setShareEmail("");
        }}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        about={about}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}

export default App;
