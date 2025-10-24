<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    protected $previousStatus;

    protected $newStatus;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Manuscript $manuscript, string $previousStatus, string $newStatus)
    {
        $this->manuscript = $manuscript;
        $this->previousStatus = $previousStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $channels = ['database']; // Always send database notification

        // Only add email if user has email notifications enabled
        if ($notifiable->email_notification_enabled ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        // Get the full name of the recipient
        $recipientName = $notifiable->firstname.' '.$notifiable->lastname;

        return (new MailMessage)
            ->subject('Manuscript Status Update: '.$this->manuscript->title)
            ->greeting('Hello '.$recipientName.',')
            ->line('The status of your manuscript has changed.')
            ->line('Title: '.$this->manuscript->title)
            ->line('Previous Status: '.$this->previousStatus)
            ->line('New Status: '.$this->newStatus)
            ->action('View Manuscript', url('/author/manuscripts/'.$this->manuscript->id))
            ->line('Thank you for using SaliksikHub.');
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
            'previous_status' => $this->previousStatus,
            'new_status' => $this->newStatus,
            'message' => 'Your manuscript "'.$this->manuscript->title.'" status has changed from '.
                $this->previousStatus.' to '.$this->newStatus.'.',
            'type' => 'status_change',  // Adding explicit type for better frontend handling
        ];
    }
}
