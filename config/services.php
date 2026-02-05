<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'crossref' => [
        'username' => env('CROSSREF_USERNAME'),
        'password' => env('CROSSREF_PASSWORD'),
        'doi_prefix' => env('CROSSREF_DOI_PREFIX', '10.00000'),
        'depositor_name' => env('CROSSREF_DEPOSITOR_NAME', 'SalikSikHub'),
        'depositor_email' => env('CROSSREF_DEPOSITOR_EMAIL', 'admin@saliksikhub.org'),
    ],

    'datacite' => [
        'username' => env('DATACITE_USERNAME'),
        'password' => env('DATACITE_PASSWORD'),
        'doi_prefix' => env('DATACITE_DOI_PREFIX', '10.00000'),
        'repository_id' => env('DATACITE_REPOSITORY_ID'),
        'api_url' => env('DATACITE_API_URL', 'https://api.test.datacite.org'), // Use test for development
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'secret' => env('PAYPAL_SECRET'),
        'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
    ],

    'sushi' => [
        'customer_id' => env('SUSHI_CUSTOMER_ID', 'saliksikhub'),
        'registry_url' => env('SUSHI_REGISTRY_URL', 'https://registry.projectcounter.org/'),
        'api_keys' => array_filter(explode(',', env('SUSHI_API_KEYS', ''))),
    ],

    'fees' => [
        'submission' => env('SUBMISSION_FEE', 50.00),
        'publication' => env('PUBLICATION_FEE', 100.00),
    ],

];
