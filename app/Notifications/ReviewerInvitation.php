<?php

namespace App\Notifications;

use App\Models\ReviewerAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewerInvitation extends Notification
{
    use Queueable;

    protected $assignment;

    /**
     * Create a new notification instance.
     */
    public function __construct(ReviewerAssignment $assignment)
    {
        $this->assignment = $assignment;
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
        return (new MailMessage)
            ->subject('Invitation to Review Manuscript')
            ->line('You have been invited to review a manuscript.')
            ->line('Title: '.$this->assignment->manuscript->title)
            ->line('Due Date: '.$this->assignment->due_date->format('Y-m-d'))
            ->action('Accept Review', route('reviewer.accept', $this->assignment->id))
            ->line('Please respond to this invitation by accepting or declining.');
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
