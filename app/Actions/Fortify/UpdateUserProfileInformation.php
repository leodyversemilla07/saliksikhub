<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'affiliation' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'orcid_id' => [
                'nullable',
                'string',
                'regex:/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/',
                Rule::unique('users')->ignore($user->id),
            ],
            'bio' => ['nullable', 'string', 'max:1000'],
        ])->validateWithBag('updateProfileInformation');

        if ($input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
                'firstname' => $input['firstname'],
                'lastname' => $input['lastname'],
                'username' => $input['username'],
                'email' => $input['email'],
                'affiliation' => $input['affiliation'],
                'country' => $input['country'],
                'orcid_id' => $input['orcid_id'] ?? null,
                'bio' => $input['bio'] ?? null,
            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  array<string, string>  $input
     */
    protected function updateVerifiedUser(User $user, array $input): void
    {
        $user->forceFill([
            'firstname' => $input['firstname'],
            'lastname' => $input['lastname'],
            'username' => $input['username'],
            'email' => $input['email'],
            'affiliation' => $input['affiliation'],
            'country' => $input['country'],
            'orcid_id' => $input['orcid_id'] ?? null,
            'bio' => $input['bio'] ?? null,
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
