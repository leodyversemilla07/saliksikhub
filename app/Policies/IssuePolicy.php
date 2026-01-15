<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Issue;
use Illuminate\Auth\Access\HandlesAuthorization;

class IssuePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']);
    }

    public function view(User $user, Issue $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) ||
               $model->journal->users()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor']);
    }

    public function update(User $user, Issue $model): bool
    {
        if ($model->status === Issue::STATUS_PUBLISHED) {
            return $user->hasRole('super_admin');
        }

        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor']) ||
               $model->journal->users()->where('user_id', $user->id)->exists();
    }

    public function delete(User $user, Issue $model): bool
    {
        if ($model->manuscripts()->exists()) {
            return false;
        }

        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']) &&
               $model->status !== Issue::STATUS_PUBLISHED;
    }

    public function publish(User $user, Issue $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'editor_in_chief']) &&
               $model->status !== Issue::STATUS_PUBLISHED;
    }

    public function archive(User $user, Issue $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function assignManuscripts(User $user, Issue $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor']) &&
               in_array($model->status, [Issue::STATUS_DRAFT, Issue::STATUS_IN_REVIEW]);
    }

    public function unassignManuscript(User $user, Issue $model): bool
    {
        return $this->assignManuscripts($user, $model);
    }

    public function addComment(User $user, Issue $model): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']);
    }
}
