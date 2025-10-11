// User related types

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

// Manuscript related types

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

export interface ManuscriptWithFiles extends Manuscript {
    files?: ManuscriptFile[];
    reviews?: Review[];
    co_authors?: CoAuthor[];
}

export interface CoAuthor {
    id: number;
    name: string;
    email: string;
    affiliation?: string;
    author_order: number;
    is_corresponding: boolean;
    contribution_role?: string[];
}

// Review related types

export interface Review {
    id: number;
    manuscript_id: number;
    manuscript_title: string;
    manuscript_abstract: string;
    status: ReviewStatus;
    status_label: string;
    status_color: string;
    invitation_sent_at: string | null;
    due_date: string | null;
    days_until_deadline: number | null;
    is_overdue: boolean;
    review_round: number;
    submitted_at: string | null;
    recommendation?: ReviewRecommendation | null;
    author_comments?: string | null;
    confidential_comments?: string | null;
    quality_rating?: number | null;
    originality_rating?: number | null;
    methodology_rating?: number | null;
    significance_rating?: number | null;
    average_rating?: number | null;
}

export type ReviewStatus = 
    | 'invited' 
    | 'accepted' 
    | 'in_progress' 
    | 'completed' 
    | 'declined';

export type ReviewRecommendation = 
    | 'accept' 
    | 'minor_revision' 
    | 'major_revision' 
    | 'reject';

export interface ReviewMetrics {
    total_reviews: number;
    completed_reviews: number;
    declined_reviews: number;
    active_reviews: number;
    average_review_time_days: number;
    acceptance_rate: number;
}

export interface ReviewFormData {
    recommendation: ReviewRecommendation | '';
    author_comments: string;
    confidential_comments: string;
    quality_rating: number;
    originality_rating: number;
    methodology_rating: number;
    significance_rating: number;
    annotated_file?: File | null;
}

export interface RecommendationOption {
    value: ReviewRecommendation;
    label: string;
    description?: string;
    color?: string;
}

// File related types

export interface ManuscriptFile {
    id: number;
    filename: string;
    file_type: FileType;
    file_type_label: string;
    file_type_color: string;
    file_size: string;
    mime_type: string;
    version: number;
    uploaded_at: string;
    uploaded_by_name: string;
    download_url: string;
}

export type FileType = 
    | 'main_document' 
    | 'cover_letter' 
    | 'figure' 
    | 'table' 
    | 'supplementary';

export interface FileRequirements {
    file_type: FileType;
    label: string;
    description: string;
    accepted_mime_types: string[];
    max_file_size: number;
    max_file_size_mb: number;
    is_required: boolean;
}

export interface FileUploadProgress {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

// Reviewer related types

export interface Reviewer {
    id: number;
    name: string;
    email: string;
    affiliation?: string;
    completed_reviews: number;
    average_review_time_days: number;
    acceptance_rate: number;
}
