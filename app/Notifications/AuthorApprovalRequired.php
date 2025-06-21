<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AuthorApprovalRequired extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    public function __construct(Manuscript $manuscript)
    {
        $this->manuscript = $manuscript;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $recipientName = $notifiable->firstname.' '.$notifiable->lastname;

        return (new MailMessage)
            ->subject('Your Approval Is Required: '.$this->manuscript->title)
            ->greeting('Hello '.$recipientName.',')
            ->line('Your manuscript "'.$this->manuscript->title.'" is ready for your final approval before publication.')
            ->line('Please review the final version and confirm your approval to proceed with publication.')
            ->action('Review and Approve', url('/author/manuscripts/'.$this->manuscript->id.'/approve'))
            ->line('Thank you for publishing with SaliksikHub.');
    }

    public function toArray($notifiable)
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'message' => 'Your approval is required for the final version of manuscript "'.$this->manuscript->title.'" before publication.',
            'type' => 'author_approval_required',
        ];
    }
}
