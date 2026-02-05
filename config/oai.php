<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OAI-PMH Repository Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the OAI-PMH protocol implementation
    |
    */

    'repository_name' => env('OAI_REPOSITORY_NAME', env('APP_NAME', 'SalikSikHub')),
    
    'base_url' => env('OAI_BASE_URL', env('APP_URL') . '/oai'),
    
    'admin_email' => env('OAI_ADMIN_EMAIL', env('MAIL_FROM_ADDRESS', 'admin@example.com')),
    
    'repository_identifier' => env('OAI_REPOSITORY_IDENTIFIER', parse_url(env('APP_URL'), PHP_URL_HOST)),
    
    /*
    |--------------------------------------------------------------------------
    | Metadata Formats
    |--------------------------------------------------------------------------
    |
    | Supported OAI metadata formats
    |
    */
    'metadata_formats' => [
        'oai_dc' => [
            'schema' => 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
            'namespace' => 'http://www.openarchives.org/OAI/2.0/oai_dc/',
        ],
        'jats' => [
            'schema' => 'https://jats.nlm.nih.gov/publishing/1.3/JATS-journalpublishing1.xsd',
            'namespace' => 'https://jats.nlm.nih.gov/ns/publishing/1.3/',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Sets Configuration
    |--------------------------------------------------------------------------
    |
    | Define OAI sets for selective harvesting
    |
    */
    'sets' => [
        'articles' => 'Research Articles',
        'reviews' => 'Review Articles',
        'openaccess' => 'Open Access',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Number of records per page in ListIdentifiers and ListRecords
    |
    */
    'records_per_page' => 100,
    
    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Cache duration for metadata (in minutes)
    |
    */
    'cache_duration' => 60,
];
