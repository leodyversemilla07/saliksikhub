<?php

namespace App\Mail;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ManuscriptStatusChanged extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Manuscript $manuscript;

    public string $oldStatus;

    public string $newStatus;

    /**
     * Create a new message instance.
     */
    public function __construct(Manuscript $manuscript, string $oldStatus, string $newStatus)
    {
        $this->manuscript = $manuscript;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Manuscript Status Updated: {$this->manuscript->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.manuscript-status-changed',
            with: [
                'manuscript' => $this->manuscript,
                'oldStatus' => $this->oldStatus,
                'newStatus' => $this->newStatus,
                'manuscriptUrl' => route('manuscripts.show', $this->manuscript->id),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
