<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJournalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasRole(['managing_editor', 'editor_in_chief']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'institution_id' => ['required', 'exists:institutions,id'],
            'name' => ['required', 'string', 'max:255'],
            'abbreviation' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'issn' => ['nullable', 'string', 'max:20'],
            'eissn' => ['nullable', 'string', 'max:20'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'submission_guidelines' => ['nullable', 'string'],
            'review_policy' => ['nullable', 'string'],
            'publication_frequency' => ['nullable', 'string', 'max:100'],
            'settings' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'institution_id.required' => 'Please select an institution.',
            'institution_id.exists' => 'The selected institution is invalid.',
            'name.required' => 'Journal name is required.',
            'logo.image' => 'The logo must be an image file.',
            'logo.max' => 'The logo must not exceed 2MB.',
            'cover_image.image' => 'The cover image must be an image file.',
            'cover_image.max' => 'The cover image must not exceed 4MB.',
        ];
    }
}
