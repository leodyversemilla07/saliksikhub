<?php

namespace App\Policies;

use App\Models\SubscriptionType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubscriptionTypePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function update(User $user, SubscriptionType $subscriptionType): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function delete(User $user, SubscriptionType $subscriptionType): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }
}
