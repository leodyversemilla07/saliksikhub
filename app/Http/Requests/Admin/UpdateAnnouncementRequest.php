<?php

namespace App\Http\Requests\Admin;

use App\Models\Announcement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'type' => ['required', 'string', Rule::in(array_keys(Announcement::TYPES))],
            'is_pinned' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:published_at'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Announcement title is required.',
            'content.required' => 'Announcement content is required.',
            'type.required' => 'Announcement type is required.',
            'type.in' => 'Invalid announcement type selected.',
            'expires_at.after' => 'Expiry date must be after the publish date.',
        ];
    }
}
