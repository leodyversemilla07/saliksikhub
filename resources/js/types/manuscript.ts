export enum ManuscriptStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export interface Manuscript {
    title: string;
    status: ManuscriptStatus;
    authors: string[];
    abstract: string;
    keywords: string[];
    manuscript_url?: string;
    created_at: string;
    updated_at: string;
}
