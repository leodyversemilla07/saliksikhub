<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptReadyForReview extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Manuscript $manuscript
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Manuscript Ready for Review - '.$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A manuscript has passed initial screening and is ready for peer review.')
            ->line('**Title:** '.$this->manuscript->title)
            ->line('**Author:** '.$this->manuscript->author->name)
            ->action('Assign Reviewers', route('editor.manuscripts.show', $this->manuscript))
            ->line('Please assign appropriate reviewers to evaluate this manuscript.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'message' => 'Manuscript ready for review: '.$this->manuscript->title,
        ];
    }
}
