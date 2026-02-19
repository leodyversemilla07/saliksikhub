<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class PlatformSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform_name',
        'platform_tagline',
        'platform_description',
        'logo_path',
        'favicon_path',
        'admin_email',
        'settings',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    /**
     * Cache key for the singleton platform settings.
     */
    protected const CACHE_KEY = 'platform_settings';

    /**
     * Get the singleton platform settings instance.
     */
    public static function instance(): static
    {
        return Cache::rememberForever(static::CACHE_KEY, function () {
            return static::firstOrCreate([], [
                'platform_name' => 'Research Platform',
                'settings' => static::getDefaultSettings(),
            ]);
        });
    }

    /**
     * Clear the cached instance after updates.
     */
    public static function clearCache(): void
    {
        Cache::forget(static::CACHE_KEY);
    }

    /**
     * Boot the model and clear cache on save/delete.
     */
    protected static function booted(): void
    {
        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }

    /**
     * Get the logo URL.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        return Storage::url($this->logo_path);
    }

    /**
     * Get the favicon URL.
     */
    public function getFaviconUrlAttribute(): ?string
    {
        if (! $this->favicon_path) {
            return null;
        }

        return Storage::url($this->favicon_path);
    }

    /**
     * Get a setting value using dot notation.
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }

    /**
     * Get merged settings with defaults.
     */
    public function getMergedSettingsAttribute(): array
    {
        return array_replace_recursive(
            static::getDefaultSettings(),
            $this->settings ?? []
        );
    }

    /**
     * Get the default settings array.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getDefaultSettings(): array
    {
        return [
            'registration' => [
                'open_registration' => true,
                'require_email_verification' => true,
                'default_role' => 'author',
                'allowed_email_domains' => [],
            ],
            'security' => [
                'session_lifetime_minutes' => 120,
                'password_min_length' => 8,
                'require_two_factor' => false,
                'max_login_attempts' => 5,
                'lockout_duration_minutes' => 15,
            ],
            'email' => [
                'from_name' => 'Research Platform',
                'from_address' => '',
                'reply_to_address' => '',
            ],
            'submissions' => [
                'max_file_size_mb' => 20,
                'allowed_file_types' => ['pdf', 'doc', 'docx'],
                'require_orcid' => false,
            ],
            'appearance' => [
                'admin_primary_color' => '#2563eb',
                'date_format' => 'M d, Y',
                'timezone' => 'UTC',
                'items_per_page' => 15,
            ],
        ];
    }

    /**
     * Get the settings schema for the admin UI.
     *
     * @return array<string, array<string, array<string, mixed>>>
     */
    public static function getSettingsSchema(): array
    {
        return [
            'registration' => [
                'open_registration' => ['type' => 'boolean', 'label' => 'Open Registration', 'description' => 'Allow new users to register accounts on the platform'],
                'require_email_verification' => ['type' => 'boolean', 'label' => 'Require Email Verification', 'description' => 'Require new users to verify their email address'],
                'default_role' => ['type' => 'select', 'label' => 'Default User Role', 'description' => 'Role assigned to newly registered users', 'options' => ['author', 'reviewer']],
                'allowed_email_domains' => ['type' => 'tags', 'label' => 'Allowed Email Domains', 'description' => 'Restrict registration to specific email domains (leave empty to allow all)'],
            ],
            'security' => [
                'session_lifetime_minutes' => ['type' => 'number', 'label' => 'Session Lifetime (Minutes)', 'description' => 'How long user sessions remain active'],
                'password_min_length' => ['type' => 'number', 'label' => 'Minimum Password Length', 'description' => 'Minimum number of characters for passwords'],
                'require_two_factor' => ['type' => 'boolean', 'label' => 'Require Two-Factor Authentication', 'description' => 'Require all users to enable two-factor authentication'],
                'max_login_attempts' => ['type' => 'number', 'label' => 'Max Login Attempts', 'description' => 'Maximum failed login attempts before lockout'],
                'lockout_duration_minutes' => ['type' => 'number', 'label' => 'Lockout Duration (Minutes)', 'description' => 'How long accounts are locked after exceeding max login attempts'],
            ],
            'email' => [
                'from_name' => ['type' => 'string', 'label' => 'From Name', 'description' => 'Name used in outgoing platform emails'],
                'from_address' => ['type' => 'string', 'label' => 'From Email Address', 'description' => 'Email address used as sender for platform emails'],
                'reply_to_address' => ['type' => 'string', 'label' => 'Reply-To Address', 'description' => 'Email address for replies to platform emails'],
            ],
            'submissions' => [
                'max_file_size_mb' => ['type' => 'number', 'label' => 'Max File Size (MB)', 'description' => 'Maximum upload file size in megabytes for all journals'],
                'allowed_file_types' => ['type' => 'tags', 'label' => 'Allowed File Types', 'description' => 'Global allowed file extensions for manuscript uploads'],
                'require_orcid' => ['type' => 'boolean', 'label' => 'Require ORCID', 'description' => 'Require authors to provide their ORCID identifier'],
            ],
            'appearance' => [
                'admin_primary_color' => ['type' => 'color', 'label' => 'Admin Panel Primary Color', 'description' => 'Primary color used in the admin panel interface'],
                'date_format' => ['type' => 'select', 'label' => 'Date Format', 'description' => 'Default date format used across the platform', 'options' => ['M d, Y', 'Y-m-d', 'd/m/Y', 'm/d/Y', 'F j, Y']],
                'timezone' => ['type' => 'select', 'label' => 'Timezone', 'description' => 'Default timezone for the platform', 'options' => ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Manila', 'Australia/Sydney']],
                'items_per_page' => ['type' => 'number', 'label' => 'Items Per Page', 'description' => 'Default number of items shown per page in listings'],
            ],
        ];
    }
}
