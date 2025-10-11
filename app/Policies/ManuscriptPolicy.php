<?php

namespace App\Policies;

use App\Models\Manuscript;
use App\Models\User;

class ManuscriptPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view manuscripts
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Manuscript $manuscript): bool
    {
        // Owner, editor, co-authors, or reviewers can view
        return $manuscript->user_id === $user->id ||
               $manuscript->editor_id === $user->id ||
               $user->hasRole(['editor', 'chief_editor']) ||
               $manuscript->reviews()->where('reviewer_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('author') || $user->hasRole(['editor', 'chief_editor']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Manuscript $manuscript): bool
    {
        // Owner or editor can update
        return $manuscript->user_id === $user->id ||
               $manuscript->editor_id === $user->id ||
               $user->hasRole(['editor', 'chief_editor']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Manuscript $manuscript): bool
    {
        // Only owner can delete, and only if not yet published
        return $manuscript->user_id === $user->id &&
               $manuscript->status->value !== 'published';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Manuscript $manuscript): bool
    {
        return $user->hasRole(['editor', 'chief_editor']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Manuscript $manuscript): bool
    {
        return $user->hasRole('chief_editor');
    }
}
