<?php

namespace App\Http\Requests\Admin;

use App\Http\Controllers\Admin\JournalUserController;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignJournalUserRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role' => ['required', 'string', Rule::in(array_keys(JournalUserController::JOURNAL_ROLES))],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Please select a user to assign.',
            'user_id.exists' => 'The selected user does not exist.',
            'role.required' => 'Please select a role for the user.',
            'role.in' => 'The selected role is invalid.',
        ];
    }
}
