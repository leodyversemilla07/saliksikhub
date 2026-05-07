<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Journal Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for journal metadata and settings
    |
    */

    'name' => env('JOURNAL_NAME', env('APP_NAME', 'SalikSikHub')),

    'issn_print' => env('JOURNAL_ISSN_PRINT', null),

    'issn' => env('JOURNAL_ISSN_ELECTRONIC', null),

    'abbreviation' => env('JOURNAL_ABBREVIATION', null),

    'publisher' => env('JOURNAL_PUBLISHER', env('APP_NAME', 'SalikSikHub')),

    'publisher_location' => env('JOURNAL_PUBLISHER_LOCATION', null),

    'description' => env('JOURNAL_DESCRIPTION', null),

    'keywords' => env('JOURNAL_KEYWORDS', null),

    'languages' => ['en', 'fil'], // Supported languages

    'primary_language' => 'en',
];
