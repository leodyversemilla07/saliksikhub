export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    email_verified_at?: string;
    roles: string[]; // Add this line to include user roles
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        roles: string[]; // Include roles here
    };
};
