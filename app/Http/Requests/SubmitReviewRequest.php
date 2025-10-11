<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensure the user is the assigned reviewer
        $review = $this->route('review');

        return $review && $review->reviewer_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'recommendation' => 'required|in:accept,minor_revision,major_revision,reject',
            'author_comments' => 'required|string|min:100|max:5000',
            'confidential_comments' => 'nullable|string|max:5000',
            'quality_rating' => 'required|integer|min:1|max:10',
            'originality_rating' => 'required|integer|min:1|max:10',
            'methodology_rating' => 'required|integer|min:1|max:10',
            'significance_rating' => 'required|integer|min:1|max:10',
            'annotated_file' => 'nullable|file|mimes:pdf|max:10240', // 10MB
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'recommendation.required' => 'Please select a recommendation.',
            'author_comments.required' => 'Comments to author are required.',
            'author_comments.min' => 'Comments to author must be at least 100 characters.',
            'author_comments.max' => 'Comments to author cannot exceed 5000 characters.',
            'quality_rating.required' => 'Quality rating is required.',
            'quality_rating.min' => 'Quality rating must be between 1 and 10.',
            'quality_rating.max' => 'Quality rating must be between 1 and 10.',
            'originality_rating.required' => 'Originality rating is required.',
            'methodology_rating.required' => 'Methodology rating is required.',
            'significance_rating.required' => 'Significance rating is required.',
            'annotated_file.mimes' => 'Annotated file must be a PDF.',
            'annotated_file.max' => 'Annotated file cannot exceed 10MB.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'recommendation' => 'recommendation',
            'author_comments' => 'comments to author',
            'confidential_comments' => 'confidential comments',
            'quality_rating' => 'quality rating',
            'originality_rating' => 'originality rating',
            'methodology_rating' => 'methodology rating',
            'significance_rating' => 'significance rating',
            'annotated_file' => 'annotated manuscript',
        ];
    }
}
