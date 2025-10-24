<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewReminder extends Notification
{
    use Queueable;

    protected Review $review;

    protected int $daysRemaining;

    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review)
    {
        $this->review = $review;
        $this->daysRemaining = $review->daysUntilDeadline() ?? 0;
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
        $urgency = $this->daysRemaining <= 3 ? 'Urgent: ' : '';

        $message = (new MailMessage)
            ->subject($urgency.'Review Reminder: '.$manuscript->title)
            ->greeting('Dear '.$notifiable->firstname.',');

        if ($this->daysRemaining > 0) {
            $message->line('This is a friendly reminder that your review is due in '.$this->daysRemaining.' days.')
                ->line('**Due Date:** '.$this->review->due_date->format('F j, Y'));
        } else {
            $message->line('This is a reminder that your review deadline has passed.')
                ->line('**Due Date:** '.$this->review->due_date->format('F j, Y'))
                ->line('We understand that circumstances may arise. If you need an extension, please contact us.');
        }

        return $message->line('**Manuscript Title:** '.$manuscript->title)
            ->action('Complete Review', route('reviewer.reviews.show', $this->review->id))
            ->line('If you need to request an extension, please do so from the review page.')
            ->line('Thank you for your contribution to peer review.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_reminder',
            'manuscript_id' => $this->review->manuscript_id,
            'manuscript_title' => $this->review->manuscript->title,
            'review_id' => $this->review->id,
            'due_date' => $this->review->due_date->toDateString(),
            'days_remaining' => $this->daysRemaining,
            'is_overdue' => $this->daysRemaining < 0,
            'message' => $this->daysRemaining > 0
                ? 'Review due in '.$this->daysRemaining.' days: '.$this->review->manuscript->title
                : 'Overdue review: '.$this->review->manuscript->title,
        ];
    }
}
