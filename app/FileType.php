<?php

namespace App;

enum FileType: string
{
    case MAIN_DOCUMENT = 'main_document';
    case COVER_LETTER = 'cover_letter';
    case FIGURE = 'figure';
    case TABLE = 'table';
    case SUPPLEMENTARY = 'supplementary';

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
}
