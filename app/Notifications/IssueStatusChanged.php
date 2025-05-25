<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IssueStatusChanged extends Notification
{
    use Queueable;

    protected $issue;
    protected $oldStatus;
    protected $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Issue $issue, $oldStatus, $newStatus)
    {
        $this->issue = $issue;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Issue Status Updated: ' . $this->issue->title)
            ->greeting('Hello ' . $notifiable->firstname . '!')
            ->line('An issue you are involved with has been updated.')
            ->line('**Title:** ' . $this->issue->title)
            ->line('**Status changed from:** ' . ucfirst(str_replace('_', ' ', $this->oldStatus)))
            ->line('**Status changed to:** ' . ucfirst(str_replace('_', ' ', $this->newStatus)))
            ->line('**Priority:** ' . ucfirst($this->issue->priority))
            ->action('View Issue', url('/issues/' . $this->issue->id))
            ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'issue_status_changed',
            'issue_id' => $this->issue->id,
            'issue_title' => $this->issue->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'issue_priority' => $this->issue->priority,
            'message' => 'Issue status changed from ' . ucfirst(str_replace('_', ' ', $this->oldStatus)) . ' to ' . ucfirst(str_replace('_', ' ', $this->newStatus)),
        ];
    }
}
