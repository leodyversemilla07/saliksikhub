<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique(User::class),
            ],
            'affiliation' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'orcid_id' => ['nullable', 'string', 'max:255', Rule::unique(User::class)],
            'password' => $this->passwordRules(),
            'role' => ['nullable', 'string', 'in:author,reviewer,associate_editor,language_editor,editor_in_chief,managing_editor'],
            'data_collection' => ['boolean'],
            'notifications' => ['boolean'],
            'review_requests' => ['boolean'],
        ])->validate();

        $role = $input['role'] ?? 'author';

        $user = User::create([
            'firstname' => $input['firstname'],
            'lastname' => $input['lastname'],
            'email' => $input['email'],
            'username' => $input['username'],
            'affiliation' => $input['affiliation'] ?? null,
            'country' => $input['country'] ?? null,
            'orcid_id' => $input['orcid_id'] ?? null,
            'password' => Hash::make($input['password']),
            'role' => $role,
            'data_collection' => $input['data_collection'] ?? false,
            'notifications' => $input['notifications'] ?? true,
            'review_requests' => $input['review_requests'] ?? true,
        ]);

        // Assign Spatie role
        $user->assignRole($role);

        // Attach user to the current journal if available
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;
        if ($journal) {
            $user->journals()->attach($journal->id, [
                'role' => $role,
                'is_active' => true,
                'assigned_at' => now(),
            ]);
        }

        return $user;
    }
}
