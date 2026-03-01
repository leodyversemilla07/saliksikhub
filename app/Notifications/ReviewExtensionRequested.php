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

    protected Review $review;

    protected \DateTime $newDueDate;

    protected string $reason;

    public function __construct(Review $review, \DateTime $newDueDate, string $reason)
    {
        $this->review = $review;
        $this->newDueDate = $newDueDate;
        $this->reason = $reason;
    }

    public function via($notifiable): array
    {
        $channels = ['database'];

        if ($notifiable->email_notification_enabled ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail($notifiable): MailMessage
    {
        $manuscript = $this->review->manuscript;
        $notifiableName = trim(($notifiable->firstname ?? '').' '.($notifiable->lastname ?? ''));
        $reviewerName = trim(($this->review->reviewer->firstname ?? '').' '.($this->review->reviewer->lastname ?? ''));

        return (new MailMessage)
            ->subject('Review Extension Requested: '.$manuscript->title)
            ->greeting('Hello '.$notifiableName.',')
            ->line('A reviewer has requested an extension for their review.')
            ->line('**Manuscript:** '.$manuscript->title)
            ->line('**Reviewer:** '.$reviewerName)
            ->line('**Original Due Date:** '.$this->review->due_date->format('F j, Y'))
            ->line('**Requested New Due Date:** '.$this->newDueDate->format('F j, Y'))
            ->line('**Reason:**')
            ->line($this->reason)
            ->action('View Review', route('editor.manuscripts.reviews', $manuscript->id))
            ->line('Please review and approve or decline this extension request.');
    }

    public function toArray($notifiable): array
    {
        $manuscript = $this->review->manuscript;
        $reviewerName = trim(($this->review->reviewer->firstname ?? '').' '.($this->review->reviewer->lastname ?? ''));

        return [
            'review_id' => $this->review->id,
            'manuscript_id' => $manuscript->id,
            'manuscript_title' => $manuscript->title,
            'reviewer_id' => $this->review->reviewer_id,
            'new_due_date' => $this->newDueDate->format('Y-m-d'),
            'reason' => $this->reason,
            'message' => 'Review extension requested for "'.$manuscript->title.'" by '.$reviewerName,
            'type' => 'review_extension_requested',
        ];
    }
}
