<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Journal;
use Illuminate\Auth\Access\HandlesAuthorization;

class JournalPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']);
    }

    public function view(User $user, Journal $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) ||
               $model->users()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasRole('super_admin');
    }

    public function update(User $user, Journal $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) ||
               $model->users()->where('user_id', $user->id)->wherePivotIn('role', ['managing_editor', 'editor_in_chief'])->exists();
    }

    public function delete(User $user, Journal $model): bool
    {
        return $user->hasRole('super_admin');
    }

    public function manageSettings(User $user, Journal $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'editor_in_chief']);
    }

    public function manageCms(User $user, Journal $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) ||
               $model->users()->where('user_id', $user->id)->wherePivotIn('role', ['managing_editor', 'editor_in_chief'])->exists();
    }

    public function manageEditorialTeam(User $user, Journal $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function assignEditor(User $user, Journal $model, User $editor): bool
    {
        return $this->manageEditorialTeam($user, $model);
    }
}
