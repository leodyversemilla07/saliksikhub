<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    protected $manuscript;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Manuscript $manuscript)
    {
        $this->manuscript = $manuscript;
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
        return (new MailMessage)
            ->subject('New Manuscript Submission: '.$this->manuscript->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A new manuscript has been submitted to SaliksikHub.')
            ->line('Title: '.$this->manuscript->title)
            ->line('Authors: '.$this->manuscript->authors)
            ->action('Review Submission', url('/editor/manuscripts/'.$this->manuscript->id))
            ->line('Thank you for your attention to this submission.');
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
            'message' => 'A new manuscript titled "'.$this->manuscript->title.'" has been submitted for review.',
        ];
    }
}
