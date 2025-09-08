<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreManuscriptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow only authenticated users with the "author" role to submit manuscripts
        return Auth::check() && Auth::user()->hasRole('author');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'required|mimes:docx|max:10240',
        ];
    }
}
