<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptDecision extends Notification
{
    use Queueable;

    protected $manuscript;

    /**
     * Create a new notification instance.
     */
    public function __construct(Manuscript $manuscript)
    {
        $this->manuscript = $manuscript;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $decision = $this->manuscript->latestDecision();

        return (new MailMessage)
            ->subject('Decision on Your Manuscript')
            ->line('A decision has been made on your manuscript.')
            ->line('Title: '.$this->manuscript->title)
            ->line('Decision: '.ucfirst($decision->decision))
            ->line('Comments: '.$decision->comments)
            ->action('View Details', route('manuscripts.show', $this->manuscript->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
