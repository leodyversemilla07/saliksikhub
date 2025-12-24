<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LanguageEditorAssigned extends Notification implements ShouldQueue
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
            ->subject('Copy Editing Assignment - '.$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('You have been assigned to copy edit the following manuscript:')
            ->line('**Title:** '.$this->manuscript->title)
            ->line('**Author:** '.$this->manuscript->author->name)
            ->action('Start Copy Editing', route('editor.manuscripts.show', $this->manuscript))
            ->line('Please review the manuscript for language, style, and clarity improvements.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'message' => 'Copy editing assignment: '.$this->manuscript->title,
        ];
    }
}
