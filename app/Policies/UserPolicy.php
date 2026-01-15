<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor']);
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor']) || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasRole('super_admin') && $user->id !== $model->id;
    }

    public function restore(User $user, User $model): bool
    {
        return $user->hasRole('super_admin');
    }

    public function forceDelete(User $user, User $model): bool
    {
        return $user->hasRole('super_admin');
    }

    public function assignRole(User $user, User $model, string $role): bool
    {
        return $user->hasRole('super_admin');
    }

    public function viewDashboard(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']);
    }
}
