<?php

namespace App\Http\Requests\UserManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // You can add more complex authorization logic here if needed
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the user id from the route
        $userId = request()->route('id');
        // Get all roles from the database
        $allRoles = Role::pluck('name')->toArray();
        $roleList = implode(',', $allRoles);

        $rules = [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,'.$userId,
            'email' => 'required|string|email|max:255|unique:users,email,'.$userId,
            'role' => 'required|string|in:'.$roleList,
            'affiliation' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ];
        if (request()->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
        }

        return $rules;
    }
}
