<?php

namespace App\Notifications;

use App\Models\Manuscript;
use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewInvitation extends Notification
{
    use Queueable;

    protected Manuscript $manuscript;

    protected Review $review;

    protected int $daysUntilDue;

    /**
     * Create a new notification instance.
     */
    public function __construct(Manuscript $manuscript, Review $review)
    {
        $this->manuscript = $manuscript;
        $this->review = $review;
        $this->daysUntilDue = $review->daysUntilDeadline() ?? 21;
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
        return (new MailMessage)
            ->subject('Review Invitation: '.$this->manuscript->title)
            ->greeting('Dear '.$notifiable->firstname.' '.$notifiable->lastname.',')
            ->line('You have been invited to review a manuscript.')
            ->line('**Manuscript Title:** '.$this->manuscript->title)
            ->line('**Review Due Date:** '.$this->review->due_date->format('F j, Y'))
            ->line('**Days to Complete:** '.$this->daysUntilDue.' days')
            ->line('**Abstract:**')
            ->line($this->manuscript->abstract)
            ->action('View Review Invitation', route('reviewer.reviews.show', $this->review->id))
            ->line('Please respond to this invitation at your earliest convenience.')
            ->line('Thank you for your contribution to peer review.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_invitation',
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'review_id' => $this->review->id,
            'due_date' => $this->review->due_date->toDateString(),
            'message' => 'You have been invited to review: '.$this->manuscript->title,
        ];
    }
}
