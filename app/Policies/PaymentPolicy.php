<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief']);
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief'])
            || $user->id === $payment->user_id;
    }

    public function refund(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['super_admin', 'managing_editor', 'editor_in_chief'])
            && $payment->status === 'completed';
    }
}
