<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    protected $comment;

    public function __construct(Manuscript $manuscript, string $comment = '')
    {
        $this->manuscript = $manuscript;
        $this->comment = $comment;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $recipientName = $notifiable->firstname.' '.$notifiable->lastname;

        $message = (new MailMessage)
            ->subject('Author Approved Manuscript: '.$this->manuscript->title)
            ->greeting('Hello '.$recipientName.',')
            ->line('The author has approved the final version of manuscript "'.$this->manuscript->title.'" for publication.')
            ->action('View Manuscript', url('/editor/manuscripts/'.$this->manuscript->id.'/prepare-publication'));

        if (! empty($this->comment)) {
            $message->line('Author Comment:')
                ->line('"'.$this->comment.'"');
        }

        return $message->line('The manuscript is now ready for publication.');
    }

    public function toArray($notifiable)
    {
        $data = [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'message' => 'Author has approved manuscript "'.$this->manuscript->title.'" for publication.',
            'type' => 'manuscript_approved',
        ];

        if (! empty($this->comment)) {
            $data['comment'] = $this->comment;
        }

        return $data;
    }
}
