<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePlatformSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['super_admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'platform_name' => ['sometimes', 'string', 'max:255'],
            'platform_tagline' => ['nullable', 'string', 'max:500'],
            'platform_description' => ['nullable', 'string', 'max:2000'],
            'admin_email' => ['nullable', 'email', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:2048'],
            'favicon' => ['nullable', 'image', 'mimes:png,ico,svg', 'max:512'],
            'settings' => ['nullable', 'array'],
            'settings.registration.open_registration' => ['nullable', 'boolean'],
            'settings.registration.require_email_verification' => ['nullable', 'boolean'],
            'settings.registration.default_role' => ['nullable', 'string', 'in:author,reviewer'],
            'settings.registration.allowed_email_domains' => ['nullable', 'array'],
            'settings.registration.allowed_email_domains.*' => ['string', 'max:255'],
            'settings.security.session_lifetime_minutes' => ['nullable', 'integer', 'min:5', 'max:1440'],
            'settings.security.password_min_length' => ['nullable', 'integer', 'min:6', 'max:128'],
            'settings.security.require_two_factor' => ['nullable', 'boolean'],
            'settings.security.max_login_attempts' => ['nullable', 'integer', 'min:1', 'max:20'],
            'settings.security.lockout_duration_minutes' => ['nullable', 'integer', 'min:1', 'max:1440'],
            'settings.email.from_name' => ['nullable', 'string', 'max:255'],
            'settings.email.from_address' => ['nullable', 'email', 'max:255'],
            'settings.email.reply_to_address' => ['nullable', 'email', 'max:255'],
            'settings.submissions.max_file_size_mb' => ['nullable', 'integer', 'min:1', 'max:100'],
            'settings.submissions.allowed_file_types' => ['nullable', 'array'],
            'settings.submissions.allowed_file_types.*' => ['string', 'max:10'],
            'settings.submissions.require_orcid' => ['nullable', 'boolean'],
            'settings.appearance.admin_primary_color' => ['nullable', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'settings.appearance.date_format' => ['nullable', 'string', 'in:M d, Y,Y-m-d,d/m/Y,m/d/Y,F j, Y'],
            'settings.appearance.timezone' => ['nullable', 'string', 'max:50'],
            'settings.appearance.items_per_page' => ['nullable', 'integer', 'min:5', 'max:100'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'platform_name.required' => 'Platform name is required.',
            'platform_name.max' => 'Platform name cannot exceed 255 characters.',
            'admin_email.email' => 'Please provide a valid email address.',
            'logo.image' => 'Logo must be an image file.',
            'logo.max' => 'Logo file size cannot exceed 2MB.',
            'favicon.image' => 'Favicon must be an image file.',
            'favicon.max' => 'Favicon file size cannot exceed 512KB.',
            'settings.appearance.admin_primary_color.regex' => 'Primary color must be a valid hex color (e.g., #2563eb).',
        ];
    }
}
