<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignReviewersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only editors can assign reviewers
        return $this->user()->isEditor();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'reviewer_ids' => 'required|array|min:2|max:5',
            'reviewer_ids.*' => 'required|integer|exists:users,id',
            'due_date' => 'required|date|after:today',
            'review_round' => 'nullable|integer|min:1|max:5',
            'invitation_message' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'reviewer_ids.required' => 'Please select at least one reviewer.',
            'reviewer_ids.min' => 'Please select at least 2 reviewers.',
            'reviewer_ids.max' => 'You can select a maximum of 5 reviewers.',
            'reviewer_ids.*.exists' => 'One or more selected reviewers are invalid.',
            'due_date.required' => 'Review due date is required.',
            'due_date.after' => 'Review due date must be in the future.',
        ];
    }
}
