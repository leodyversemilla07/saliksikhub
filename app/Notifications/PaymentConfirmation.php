<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    protected Payment $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function via($notifiable): array
    {
        $channels = ['database'];

        if ($notifiable->email_notification_enabled ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail($notifiable): MailMessage
    {
        $recipientName = $notifiable->firstname . ' ' . $notifiable->lastname;
        $typeLabel = ucfirst(str_replace('_', ' ', $this->payment->type));

        return (new MailMessage)
            ->subject('Payment Confirmation - ' . $this->payment->transaction_id)
            ->greeting('Hello ' . $recipientName . ',')
            ->line('Your payment has been successfully processed.')
            ->line('**Transaction ID:** ' . $this->payment->transaction_id)
            ->line('**Type:** ' . $typeLabel)
            ->line('**Amount:** ' . $this->payment->currency . ' ' . number_format($this->payment->amount, 2))
            ->line('**Date:** ' . $this->payment->paid_at->format('F j, Y g:i A'))
            ->line('**Payment Method:** ' . ucfirst($this->payment->gateway ?? 'N/A'))
            ->line('Thank you for your payment.');
    }

    public function toArray($notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'transaction_id' => $this->payment->transaction_id,
            'amount' => $this->payment->amount,
            'currency' => $this->payment->currency,
            'type' => $this->payment->type,
            'message' => 'Payment of ' . $this->payment->currency . ' ' .
                number_format($this->payment->amount, 2) . ' confirmed. Transaction: ' .
                $this->payment->transaction_id,
            'type' => 'payment_confirmation',
        ];
    }
}
