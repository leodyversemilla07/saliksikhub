export interface User {
    id: number;
    firstname: string;
    lastname: string;
    role: string;
    affiliation?: string;
    email: string;
    email_verified_at?: string;
    created_at?: Date;
    updated_at?: Date;
    avatar?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
