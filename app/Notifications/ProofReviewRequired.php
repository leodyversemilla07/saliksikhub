<?php

namespace App\Notifications;

use App\Models\Manuscript;
use App\Models\ProofCorrection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProofReviewRequired extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Manuscript $manuscript,
        public ProofCorrection $proof
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Proof Review Required - '.$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('The proofs for your manuscript are ready for review.')
            ->line('**Title:** '.$this->manuscript->title)
            ->line('**Proof Round:** '.$this->proof->proof_round)
            ->line('Please review the proofs carefully and approve them or request corrections within 48-72 hours.')
            ->action('Review Proofs', url('/author/manuscripts'))
            ->line('Thank you for your prompt attention to this matter.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'proof_id' => $this->proof->id,
            'proof_round' => $this->proof->proof_round,
            'message' => 'Proof review required for: '.$this->manuscript->title,
        ];
    }
}
