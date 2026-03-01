<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubscriptionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function view(User $user, Subscription $subscription): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief'])
            || $user->id === $subscription->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function update(User $user, Subscription $subscription): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }
}
