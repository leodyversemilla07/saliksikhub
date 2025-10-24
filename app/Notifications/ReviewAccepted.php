<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewAccepted extends Notification
{
    use Queueable;

    protected Review $review;

    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        $channels = ['database']; // Always send database notification

        // Only add email if user has email notifications enabled
        if ($notifiable->email_notification_enabled ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $manuscript = $this->review->manuscript;
        $reviewer = $this->review->reviewer;

        return (new MailMessage)
            ->subject('Review Accepted: '.$manuscript->title)
            ->greeting('Dear '.$notifiable->firstname.',')
            ->line('Good news! A reviewer has accepted the invitation to review your manuscript.')
            ->line('**Manuscript Title:** '.$manuscript->title)
            ->line('**Review Due Date:** '.$this->review->due_date->format('F j, Y'))
            ->line('The reviewer will submit their feedback by the due date.')
            ->action('View Manuscript', route('editor.manuscripts.show', $manuscript->id))
            ->line('Thank you for your patience.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_accepted',
            'manuscript_id' => $this->review->manuscript_id,
            'manuscript_title' => $this->review->manuscript->title,
            'review_id' => $this->review->id,
            'message' => 'A reviewer accepted the invitation for: '.$this->review->manuscript->title,
        ];
    }
}
