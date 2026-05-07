<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionRenewalReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected Subscription $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
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
        $recipientName = $notifiable->firstname.' '.$notifiable->lastname;
        $daysLeft = now()->diffInDays($this->subscription->date_end);

        return (new MailMessage)
            ->subject('Subscription Renewal Reminder')
            ->greeting('Hello '.$recipientName.',')
            ->line('Your subscription is expiring soon.')
            ->line('**Subscription:** '.$this->subscription->subscriptionType->name)
            ->line('**Expires on:** '.$this->subscription->date_end->format('F j, Y'))
            ->line('**Days remaining:** '.$daysLeft)
            ->line('Please renew your subscription to maintain uninterrupted access.')
            ->line('Thank you for using SaliksikHub.');
    }

    public function toArray($notifiable): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'subscription_type' => $this->subscription->subscriptionType->name,
            'end_date' => $this->subscription->date_end->toDateString(),
            'message' => 'Your subscription "'.$this->subscription->subscriptionType->name.
                '" expires on '.$this->subscription->date_end->format('F j, Y').'.',
            'type' => 'subscription_renewal_reminder',
        ];
    }
}
