<?php

namespace App\Mail;

use App\Models\EditorialDecision as EditorialDecisionModel;
use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EditorialDecision extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Manuscript $manuscript;

    public EditorialDecisionModel $decision;

    /**
     * Create a new message instance.
     */
    public function __construct(Manuscript $manuscript, EditorialDecisionModel $decision)
    {
        $this->manuscript = $manuscript;
        $this->decision = $decision;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->decision->decision) {
            'accept' => "Manuscript Accepted: {$this->manuscript->title}",
            'minor_revision' => "Revisions Required: {$this->manuscript->title}",
            'major_revision' => "Revisions Required: {$this->manuscript->title}",
            'reject' => "Manuscript Decision: {$this->manuscript->title}",
            default => "Editorial Decision: {$this->manuscript->title}",
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.editorial-decision',
            with: [
                'manuscript' => $this->manuscript,
                'decision' => $this->decision,
                'manuscriptUrl' => route('manuscripts.show', $this->manuscript->id),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
