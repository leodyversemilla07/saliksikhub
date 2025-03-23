<?php

namespace App\Notifications;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManuscriptPublished extends Notification implements ShouldQueue
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
        $recipientName = $notifiable->firstname . ' ' . $notifiable->lastname;
        
        $message = (new MailMessage)
            ->subject('Congratulations! Your Manuscript Has Been Published: ' . $this->manuscript->title)
            ->greeting('Hello ' . $recipientName . ',')
            ->line('We are pleased to inform you that your manuscript has been published.')
            ->line('Title: ' . $this->manuscript->title);
            
        if ($this->manuscript->doi) {
            $message->line('DOI: ' . $this->manuscript->doi);
        }
        
        if ($this->manuscript->volume) {
            $details = 'Volume: ' . $this->manuscript->volume;
            if ($this->manuscript->issue) {
                $details .= ', Issue: ' . $this->manuscript->issue;
            }
            if ($this->manuscript->page_range) {
                $details .= ', Pages: ' . $this->manuscript->page_range;
            }
            $message->line($details);
        }
        
        return $message
            ->action('View Published Manuscript', url('/author/manuscripts/' . $this->manuscript->id))
            ->line('Thank you for publishing with SaliksikHub.');
    }

    public function toArray($notifiable)
    {
        return [
            'manuscript_id' => $this->manuscript->id,
            'manuscript_title' => $this->manuscript->title,
            'doi' => $this->manuscript->doi,
            'volume' => $this->manuscript->volume,
            'issue' => $this->manuscript->issue,
            'page_range' => $this->manuscript->page_range,
            'publication_date' => $this->manuscript->publication_date ? $this->manuscript->publication_date->format('Y-m-d') : null,
            'message' => 'Your manuscript "' . $this->manuscript->title . '" has been published.',
            'type' => 'manuscript_published',
        ];
    }
}
