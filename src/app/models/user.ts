export interface ProfileUser {
    uid: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    displayName: string | null | undefined;
    phone?: string;
    dateOfBirth?: string;
    photoURL?: string;
    role?: Roles[];
  }

export type Roles = "user" | "editor" | "admin";