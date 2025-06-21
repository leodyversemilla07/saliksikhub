<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IssueAssigned extends Notification
{
    use Queueable;

    protected $issue;

    protected $manuscript;

    /**
     * Create a new notification instance.
     */
    public function __construct(Issue $issue, $manuscript = null)
    {
        $this->issue = $issue;
        $this->manuscript = $manuscript;
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
        $messageBuilder = (new MailMessage)
            ->subject('Manuscript Assigned to Journal Issue')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your manuscript has been assigned to a journal issue.');

        if ($this->manuscript) {
            $messageBuilder->line('**Manuscript:** '.$this->manuscript->title);
        }

        $messageBuilder->line('**Journal Issue:** Volume '.$this->issue->volume_number.', Issue '.$this->issue->issue_number)
            ->line('**Publication Date:** '.($this->issue->publication_date ? $this->issue->publication_date->format('F j, Y') : 'To be determined'));

        if ($this->issue->issue_title) {
            $messageBuilder->line('**Issue Title:** '.$this->issue->issue_title);
        }

        $messageBuilder->action('View Issue', url('/issues/'.$this->issue->id))
            ->line('Thank you for your contribution to our journal!');

        return $messageBuilder;
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        $data = [
            'type' => 'journal_issue_assigned',
            'issue_id' => $this->issue->id,
            'volume_number' => $this->issue->volume_number,
            'issue_number' => $this->issue->issue_number,
            'message' => 'Your manuscript has been assigned to Journal Volume '.$this->issue->volume_number.', Issue '.$this->issue->issue_number,
        ];

        if ($this->manuscript) {
            $data['manuscript_id'] = $this->manuscript->id;
            $data['manuscript_title'] = $this->manuscript->title;
        }

        return $data;
    }
}
