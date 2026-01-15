<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewExtensionRequested extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;

    protected $newDueDate;

    protected $reason;

    public function __construct(Review $review, \DateTime $newDueDate, string $reason)
    {
        $this->review = $review;
        $this->newDueDate = $newDueDate;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        $channels = ['database'];

        if ($notifiable->email_notification_enabled ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail($notifiable)
    {
        $manuscript = $this->review->manuscript;

        return (new MailMessage)
            ->subject('Review Extension Requested: '.$manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A reviewer has requested an extension for their review.')
            ->line('**Manuscript:** '.$manuscript->title)
            ->line('**Reviewer:** '.$this->review->reviewer->name)
            ->line('**Original Due Date:** '.$this->review->due_date->format('F j, Y'))
            ->line('**Requested New Due Date:** '.$this->newDueDate->format('F j, Y'))
            ->line('**Reason:**')
            ->line($this->reason)
            ->action('View Review', route('editor.manuscripts.reviews', $manuscript->id))
            ->line('Please review and approve or decline this extension request.');
    }

    public function toArray($notifiable)
    {
        $manuscript = $this->review->manuscript;

        return [
            'review_id' => $this->review->id,
            'manuscript_id' => $manuscript->id,
            'manuscript_title' => $manuscript->title,
            'reviewer_id' => $this->review->reviewer_id,
            'new_due_date' => $this->newDueDate->toDateString(),
            'reason' => $this->reason,
            'message' => 'Review extension requested for "'.$manuscript->title.'" by '.$this->review->reviewer->name,
            'type' => 'review_extension_requested',
        ];
    }
}
