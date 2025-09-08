<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SubmitRevisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only authenticated authors can submit revisions
        return Auth::check() && Auth::user()->hasRole('author');
    }

    public function rules(): array
    {
        return [
            'revised_manuscript' => 'required|mimes:pdf|max:10240',
            'revision_comments' => 'required|string|min:10',
        ];
    }
}
