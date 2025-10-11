<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewSubmitted extends Notification
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $manuscript = $this->review->manuscript;
        $reviewer = $this->review->reviewer;

        return (new MailMessage)
            ->subject('Review Submitted: '.$manuscript->title)
            ->greeting('Dear '.$notifiable->firstname.',')
            ->line('A review has been submitted for your manuscript.')
            ->line('**Manuscript Title:** '.$manuscript->title)
            ->line('**Reviewer:** Reviewer '.$this->review->id.' (anonymous)')
            ->line('**Recommendation:** '.$this->review->recommendation->label())
            ->line('**Submitted On:** '.$this->review->review_submitted_at->format('F j, Y'))
            ->action('View Review', route('editor.manuscripts.reviews', $manuscript->id))
            ->line('Please review the feedback at your earliest convenience.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_submitted',
            'manuscript_id' => $this->review->manuscript_id,
            'manuscript_title' => $this->review->manuscript->title,
            'review_id' => $this->review->id,
            'recommendation' => $this->review->recommendation->value,
            'message' => 'A review has been submitted for: '.$this->review->manuscript->title,
        ];
    }
}
