export type UserRole =
    | 'managing_editor'
    | 'editor_in_chief'
    | 'associate_editor'
    | 'language_editor'
    | 'author'
    | 'reviewer';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    role?: UserRole;
    affiliation?: string;
    country?: string;
    username?: string;
    avatar?: string;
    avatar_url?: string | null;
    data_collection?: boolean;
    notifications?: boolean;
    review_requests?: boolean;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
