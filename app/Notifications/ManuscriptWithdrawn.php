<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptWithdrawn extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    protected $reason;

    protected $withdrawnBy;

    public function __construct(Manuscript $manuscript, string $reason, string $withdrawnBy = 'Author')
    {
        $this->manuscript = $manuscript;
        $this->reason = $reason;
        $this->withdrawnBy = $withdrawnBy;
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
        return (new MailMessage)
            ->subject('Manuscript Withdrawn: '.$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A manuscript has been withdrawn from the review process.')
            ->line('**Title:** '.$this->manuscript->title)
            ->line('**Withdrawn By:** '.$this->withdrawnBy)
            ->line('**Reason:** '.$this->reason)
            ->line('The manuscript is no longer under consideration for publication.');
    }

    public function toArray($notifiable)
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'reason' => $this->reason,
            'withdrawn_by' => $this->withdrawnBy,
            'message' => 'Manuscript "'.$this->manuscript->title.'" has been withdrawn by '.$this->withdrawnBy.'.',
            'type' => 'manuscript_withdrawn',
        ];
    }
}
