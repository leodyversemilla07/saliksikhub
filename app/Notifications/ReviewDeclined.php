<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewDeclined extends Notification
{
    use Queueable;

    protected Review $review;

    protected ?string $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review, ?string $reason = null)
    {
        $this->review = $review;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
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
        $manuscript = $this->review->manuscript;

        $message = (new MailMessage)
            ->subject('Review Declined: '.$manuscript->title)
            ->greeting('Dear '.$notifiable->firstname.',')
            ->line('A reviewer has declined the invitation to review your manuscript.')
            ->line('**Manuscript Title:** '.$manuscript->title);

        if ($this->reason) {
            $message->line('**Reason:** '.$this->reason);
        }

        return $message->line('You may want to assign a different reviewer.')
            ->action('Assign Reviewer', route('editor.manuscripts.assign_reviewers', $manuscript->id))
            ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_declined',
            'manuscript_id' => $this->review->manuscript_id,
            'manuscript_title' => $this->review->manuscript->title,
            'review_id' => $this->review->id,
            'reason' => $this->reason,
            'message' => 'A reviewer declined the invitation for: '.$this->review->manuscript->title,
        ];
    }
}
