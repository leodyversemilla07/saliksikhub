<?php

namespace App\Mail;

use App\Models\Manuscript;
use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Manuscript $manuscript;

    public Review $review;

    /**
     * Create a new message instance.
     */
    public function __construct(Manuscript $manuscript, Review $review)
    {
        $this->manuscript = $manuscript;
        $this->review = $review;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Review Submitted: {$this->manuscript->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.review-submitted',
            with: [
                'manuscript' => $this->manuscript,
                'review' => $this->review,
                'reviewUrl' => route('reviewer.reviews.show', $this->review->id),
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
