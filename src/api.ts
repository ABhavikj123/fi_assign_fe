import type { AboutResponse, ApiErrorPayload, Note, NotePayload } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

type RequestOptions = {
  token?: string | null;
  method?: string;
  body?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(
    message: string,
    status: number,
    payload?: ApiErrorPayload
  ) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const request = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? ((await response.json()) as ApiErrorPayload | T)
    : undefined;

  if (!response.ok) {
    const message =
      (payload as ApiErrorPayload | undefined)?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload as ApiErrorPayload);
  }

  return payload as T;
};

export const api = {
  baseUrl: API_BASE_URL,

  register: (email: string, password: string) =>
    request<{ message: string }>("/register", {
      method: "POST",
      body: { email, password }
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string }>("/login", {
      method: "POST",
      body: { email, password }
    }),

  about: () => request<AboutResponse>("/about"),

  listNotes: (token: string, archived = false) =>
    request<Note[]>(`/notes?archived=${archived}`, { token }),

  searchNotes: (token: string, query: string, archived = false) =>
    request<Note[]>(
      `/search?q=${encodeURIComponent(query)}&archived=${archived}`,
      { token }
    ),

  createNote: (token: string, payload: NotePayload) =>
    request<Note>("/notes", {
      token,
      method: "POST",
      body: payload
    }),

  updateNote: (token: string, id: string, payload: NotePayload) =>
    request<Note>(`/notes/${id}`, {
      token,
      method: "PUT",
      body: payload
    }),

  deleteNote: (token: string, id: string) =>
    request<void>(`/notes/${id}`, {
      token,
      method: "DELETE"
    }),

  shareNote: (token: string, id: string, shareWithEmail: string) =>
    request<{ message: string }>(`/notes/${id}/share`, {
      token,
      method: "POST",
      body: { share_with_email: shareWithEmail }
    }),

  archiveNote: (token: string, id: string) =>
    request<Note>(`/notes/${id}/archive`, {
      token,
      method: "PATCH"
    }),

  unarchiveNote: (token: string, id: string) =>
    request<Note>(`/notes/${id}/unarchive`, {
      token,
      method: "PATCH"
    })
};
