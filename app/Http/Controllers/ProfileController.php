<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Expertise;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('profile/edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'expertises' => Expertise::all(),
            'userExpertises' => $request->user()->expertises->pluck('id'),
        ]);
    }

    /**
     * Update the user's profile information.
     *
     * @param  ProfileUpdateRequest|\Illuminate\Http\Request  $request
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = Auth::user();
        if (! ($user instanceof User)) {
            throw new \Exception('Authenticated user is not a valid User model.');
        }

        // Handle avatar upload and deletion in controller
        if ($request->hasFile('avatar')) {
            $avatarFile = $request->file('avatar');

            // Ensure the avatars directory exists
            if (! Storage::disk('public')->exists('avatars')) {
                Storage::disk('public')->makeDirectory('avatars');
            }

            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete('avatars/'.$user->avatar);
                $user->avatar = null;
            }

            // Generate a unique filename using Laravel's hashName method
            $avatarName = $user->id.'_'.time().'_'.$avatarFile->hashName();

            // Store new avatar using Laravel's Storage facade
            $avatarFile->storeAs('avatars', $avatarName, 'public');

            // Only store the filename, not the full path
            $validated['avatar'] = $avatarName;
        } else {
            // Remove avatar from validated data if no file uploaded to prevent overwriting existing avatar
            unset($validated['avatar']);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if (isset($validated['expertises'])) {
            $user->expertises()->sync($validated['expertises']);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete user's avatar before deleting the account
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/'.$user->avatar);
            $user->avatar = null;
            $user->save();
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
