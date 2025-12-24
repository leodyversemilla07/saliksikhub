<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProductionAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Manuscript $manuscript,
        public string $stage = 'typesetting'
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $stageLabel = ucfirst($this->stage);

        return (new MailMessage)
            ->subject("{$stageLabel} Assignment - ".$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line("A manuscript has been assigned to you for {$this->stage}:")
            ->line('**Title:** '.$this->manuscript->title)
            ->line('**Author:** '.$this->manuscript->author->name)
            ->action('Start '.$stageLabel, route('editor.manuscripts.show', $this->manuscript))
            ->line("Please complete the {$this->stage} process and generate the necessary files.");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'stage' => $this->stage,
            'message' => ucfirst($this->stage).' assignment: '.$this->manuscript->title,
        ];
    }
}
