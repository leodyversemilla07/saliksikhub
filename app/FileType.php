<?php

namespace App;

enum FileType: string
{
    case MAIN_DOCUMENT = 'main_document';
    case COVER_LETTER = 'cover_letter';
    case FIGURE = 'figure';
    case TABLE = 'table';
    case SUPPLEMENTARY = 'supplementary';

    /**
     * Get human-readable label for the file type
     */
    public function label(): string
    {
        return match ($this) {
            self::MAIN_DOCUMENT => 'Main Document',
            self::COVER_LETTER => 'Cover Letter',
            self::FIGURE => 'Figure',
            self::TABLE => 'Table',
            self::SUPPLEMENTARY => 'Supplementary Material',
        };
    }

    /**
     * Get description of the file type
     */
    public function description(): string
    {
        return match ($this) {
            self::MAIN_DOCUMENT => 'Primary manuscript file (PDF, Word, LaTeX)',
            self::COVER_LETTER => 'Cover letter for submission',
            self::FIGURE => 'Figure or image file',
            self::TABLE => 'Table or data file',
            self::SUPPLEMENTARY => 'Additional supporting materials',
        };
    }

    /**
     * Get accepted MIME types for this file type
     */
    public function acceptedMimeTypes(): array
    {
        return match ($this) {
            self::MAIN_DOCUMENT => [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/x-latex',
                'text/x-tex',
            ],
            self::COVER_LETTER => [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
            ],
            self::FIGURE => [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/tiff',
                'image/svg+xml',
                'application/pdf',
            ],
            self::TABLE => [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv',
                'application/pdf',
            ],
            self::SUPPLEMENTARY => [
                '*/*', // Accept all file types for supplementary materials
            ],
        };
    }

    /**
     * Get maximum file size in bytes
     */
    public function maxFileSize(): int
    {
        return match ($this) {
            self::MAIN_DOCUMENT => 104857600, // 100 MB
            self::COVER_LETTER => 10485760,   // 10 MB
            self::FIGURE => 52428800,         // 50 MB
            self::TABLE => 20971520,          // 20 MB
            self::SUPPLEMENTARY => 104857600, // 100 MB
        };
    }

    /**
     * Check if this file type is required for submission
     */
    public function isRequired(): bool
    {
        return in_array($this, [
            self::MAIN_DOCUMENT,
            self::COVER_LETTER,
        ]);
    }

    /**
     * Get icon class for UI display
     */
    public function icon(): string
    {
        return match ($this) {
            self::MAIN_DOCUMENT => 'document-text',
            self::COVER_LETTER => 'mail',
            self::FIGURE => 'photograph',
            self::TABLE => 'table',
            self::SUPPLEMENTARY => 'paper-clip',
        };
    }

    /**
     * Get color for UI display
     */
    public function color(): string
    {
        return match ($this) {
            self::MAIN_DOCUMENT => 'blue',
            self::COVER_LETTER => 'green',
            self::FIGURE => 'purple',
            self::TABLE => 'orange',
            self::SUPPLEMENTARY => 'gray',
        };
    }
}
