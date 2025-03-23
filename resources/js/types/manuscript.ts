export enum ManuscriptStatus {
    SUBMITTED = 'Submitted',
    UNDER_REVIEW = 'Under Review',
    MINOR_REVISION = 'Minor Revision',
    MAJOR_REVISION = 'Major Revision',
    ACCEPTED = 'Accepted',
    IN_COPYEDITING = 'Copyediting',
    AWAITING_AUTHOR_APPROVAL = 'Awaiting Approval',
    READY_FOR_PUBLICATION = 'Ready to Publish',
    REJECTED = 'Rejected',
    PUBLISHED = 'Published'
}

export interface Manuscript {
    id: number;
    user_id: number;
    title: string;
    authors: string[];
    abstract: string;
    keywords: string[];
    manuscript_path?: string;
    status: ManuscriptStatus;
    revision_history?: string[];
    revision_comments?: string[];
    revised_at?: string;
    editor_id?: number;
    decision_date?: string;
    publication_date?: string;
    doi?: string;
    volume?: number;
    issue?: number;
    page_range?: string;
    final_pdf_path?: string;
    author_approval_date?: string;
    created_at: string;
    updated_at: string;
}
