<?php

namespace App\Notifications;

use App\Models\EditorialDecision;
use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptDecision extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    protected $decision;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Manuscript $manuscript, EditorialDecision $decision)
    {
        $this->manuscript = $manuscript;
        $this->decision = $decision;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('Decision on Your Manuscript: '.$this->manuscript->title)
            ->greeting('Dear '.$notifiable->name.',')
            ->line('A decision has been made on your manuscript titled "'.$this->manuscript->title.'".');

        switch ($this->decision->decision_type) {
            case EditorialDecision::DECISION_TYPES['ACCEPT']:
                $mailMessage->line('We are pleased to inform you that your manuscript has been accepted for publication.');
                break;
            case EditorialDecision::DECISION_TYPES['REJECT']:
                $mailMessage->line('We regret to inform you that your manuscript has not been accepted for publication.');
                break;
            case EditorialDecision::DECISION_TYPES['MINOR_REVISION']:
                $mailMessage->line('Your manuscript requires minor revisions before it can be accepted for publication.');
                if ($this->decision->revision_deadline) {
                    $mailMessage->line('Please submit your revision by: '.$this->decision->revision_deadline->format('F j, Y'));
                }
                break;
            case EditorialDecision::DECISION_TYPES['MAJOR_REVISION']:
                $mailMessage->line('Your manuscript requires major revisions before it can be considered for publication.');
                if ($this->decision->revision_deadline) {
                    $mailMessage->line('Please submit your revision by: '.$this->decision->revision_deadline->format('F j, Y'));
                }
                break;
            default:
                $mailMessage->line('Please check your manuscript status in the system for details.');
        }

        return $mailMessage
            ->line('Editor\'s Comments:')
            ->line($this->decision->comments_to_author)
            ->action('View Manuscript', url('/author/manuscripts/'.$this->manuscript->id))
            ->line('Thank you for submitting to our journal.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'decision_type' => $this->decision->decision_type,
            'decision_date' => $this->decision->decision_date,
            'comments' => $this->decision->comments_to_author,
        ];
    }
}
