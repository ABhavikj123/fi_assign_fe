export type AuthMode = "login" | "register";

export type NoteAccess = "owner" | "shared";

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  owner_id?: string;
  is_archived?: boolean;
  access?: NoteAccess;
};

export type AboutResponse = {
  name: string;
  email: string;
  "my features": Record<string, string>;
};

export type ApiErrorPayload = {
  message?: string;
  errors?: Array<{
    path?: string;
    message: string;
  }>;
};

export type NotePayload = {
  title: string;
  content: string;
};
