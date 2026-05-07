<?php

namespace App\Services;

use App\Core\Plugin\Hook;
use App\Models\Manuscript;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\PaymentConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Create a submission fee payment
     */
    public function createSubmissionFee(
        Manuscript $manuscript,
        int $userId,
        float $amount,
        string $currency = 'USD'
    ): Payment {
        return Payment::create([
            'user_id' => $userId,
            'manuscript_id' => $manuscript->id,
            'amount' => $amount,
            'currency' => $currency,
            'payment_type' => 'submission_fee',
            'status' => 'pending',
            'transaction_id' => $this->generateTransactionId(),
        ]);
    }

    /**
     * Create a publication charge payment
     */
    public function createPublicationCharge(
        Manuscript $manuscript,
        int $userId,
        float $amount,
        string $currency = 'USD'
    ): Payment {
        return Payment::create([
            'user_id' => $userId,
            'manuscript_id' => $manuscript->id,
            'amount' => $amount,
            'currency' => $currency,
            'payment_type' => 'publication_charge',
            'status' => 'pending',
            'transaction_id' => $this->generateTransactionId(),
        ]);
    }

    /**
     * Create a subscription payment
     */
    public function createSubscriptionPayment(
        Subscription $subscription,
        int $userId,
        float $amount,
        string $currency = 'USD'
    ): Payment {
        $payment = Payment::create([
            'user_id' => $userId,
            'amount' => $amount,
            'currency' => $currency,
            'payment_type' => 'subscription_fee',
            'status' => 'pending',
            'transaction_id' => $this->generateTransactionId(),
        ]);

        $subscription->update([
            'payment_id' => $payment->id,
        ]);

        return $payment;
    }

    /**
     * Process payment with Stripe
     */
    public function processWithStripe(Payment $payment, array $paymentData): array
    {
        $stripeKey = config('services.stripe.secret') ?? '';

        if (empty($stripeKey)) {
            throw new \Exception('Stripe is not configured');
        }

        try {
            // Create Stripe payment intent
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$stripeKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])->asForm()->post('https://api.stripe.com/v1/payment_intents', [
                'amount' => (int) ($payment->amount * 100), // Convert to cents
                'currency' => strtolower($payment->currency),
                'payment_method' => $paymentData['payment_method_id'] ?? null,
                'confirm' => true,
                'metadata' => [
                    'payment_id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'type' => $payment->payment_type,
                ],
                'return_url' => route('payments.return'),
            ]);

            if (! $response->successful()) {
                throw new \Exception('Stripe payment failed: '.$response->body());
            }

            $result = $response->json();

            // Update payment record
            $payment->update([
                'status' => 'processing',
                'payment_gateway' => 'stripe',
                'gateway_transaction_id' => $result['id'],
                'gateway_response' => json_encode($result),
            ]);

            // Check if payment requires further action
            if ($result['status'] === 'requires_action') {
                return [
                    'success' => false,
                    'requires_action' => true,
                    'client_secret' => $result['client_secret'],
                    'payment_intent_id' => $result['id'],
                ];
            }

            // Mark as completed if successful
            if ($result['status'] === 'succeeded') {
                $this->markAsCompleted($payment, $result['id']);

                return [
                    'success' => true,
                    'payment_id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                ];
            }

            return [
                'success' => false,
                'status' => $result['status'],
                'message' => 'Payment requires confirmation',
            ];

        } catch (\Exception $e) {
            $this->markAsFailed($payment, $e->getMessage());

            throw $e;
        }
    }

    /**
     * Process payment with PayPal
     */
    public function processWithPayPal(Payment $payment): array
    {
        $clientId = config('services.paypal.client_id') ?? '';
        $secret = config('services.paypal.secret') ?? '';
        $mode = config('services.paypal.mode', 'sandbox');

        if (empty($clientId) || empty($secret)) {
            throw new \Exception('PayPal is not configured');
        }

        $baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        try {
            // Get access token
            $tokenResponse = Http::withBasicAuth($clientId, $secret)
                ->asForm()
                ->post("{$baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials',
                ]);

            if (! $tokenResponse->successful()) {
                throw new \Exception('PayPal authentication failed');
            }

            $accessToken = $tokenResponse->json()['access_token'];

            // Create order
            $orderResponse = Http::withToken($accessToken)
                ->post("{$baseUrl}/v2/checkout/orders", [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [
                        [
                            'reference_id' => $payment->transaction_id,
                            'amount' => [
                                'currency_code' => $payment->currency,
                                'value' => number_format($payment->amount, 2, '.', ''),
                            ],
                            'description' => ucfirst(str_replace('_', ' ', $payment->payment_type)),
                        ],
                    ],
                    'application_context' => [
                        'return_url' => route('payments.return'),
                        'cancel_url' => route('payments.cancel'),
                    ],
                ]);

            if (! $orderResponse->successful()) {
                throw new \Exception('PayPal order creation failed: '.$orderResponse->body());
            }

            $order = $orderResponse->json();

            // Update payment record
            $payment->update([
                'status' => 'processing',
                'payment_gateway' => 'paypal',
                'gateway_transaction_id' => $order['id'],
                'gateway_response' => json_encode($order),
            ]);

            // Get approval URL
            $approvalUrl = collect($order['links'])->firstWhere('rel', 'approve')['href'] ?? null;

            return [
                'success' => true,
                'requires_redirect' => true,
                'approval_url' => $approvalUrl,
                'order_id' => $order['id'],
                'payment_id' => $payment->id,
            ];

        } catch (\Exception $e) {
            $this->markAsFailed($payment, $e->getMessage());

            throw $e;
        }
    }

    /**
     * Capture PayPal payment after approval
     */
    public function capturePayPalPayment(Payment $payment, string $orderId): array
    {
        $clientId = config('services.paypal.client_id') ?? '';
        $secret = config('services.paypal.secret') ?? '';
        $mode = config('services.paypal.mode', 'sandbox');

        $baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        try {
            // Get access token
            $tokenResponse = Http::withBasicAuth($clientId, $secret)
                ->asForm()
                ->post("{$baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials',
                ]);

            $accessToken = $tokenResponse->json()['access_token'];

            // Capture payment
            $captureResponse = Http::withToken($accessToken)
                ->post("{$baseUrl}/v2/checkout/orders/{$orderId}/capture");

            if (! $captureResponse->successful()) {
                throw new \Exception('PayPal capture failed: '.$captureResponse->body());
            }

            $result = $captureResponse->json();

            // Update payment
            $payment->update([
                'gateway_response' => json_encode($result),
            ]);

            // Check if captured successfully
            if ($result['status'] === 'COMPLETED') {
                $captureId = $result['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
                $this->markAsCompleted($payment, $captureId);

                return [
                    'success' => true,
                    'payment_id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                ];
            }

            return [
                'success' => false,
                'status' => $result['status'],
                'message' => 'Payment capture failed',
            ];

        } catch (\Exception $e) {
            $this->markAsFailed($payment, $e->getMessage());

            throw $e;
        }
    }

    /**
     * Mark payment as completed
     */
    public function markAsCompleted(Payment $payment, ?string $gatewayTransactionId = null): Payment
    {
        $payment->update([
            'status' => 'completed',
            'paid_at' => now(),
            'gateway_transaction_id' => $gatewayTransactionId ?? $payment->gateway_transaction_id,
        ]);

        // Trigger any post-payment actions
        $this->handlePostPaymentActions($payment);

        // Fire action hook after payment completed
        Hook::doAction('payment.completed', $payment);

        return $payment;
    }

    /**
     * Mark payment as failed
     */
    public function markAsFailed(Payment $payment, string $errorMessage): Payment
    {
        $payment->update([
            'status' => 'failed',
            'gateway_response' => json_encode([
                'error' => $errorMessage,
                'failed_at' => now()->toIso8601String(),
            ]),
        ]);

        // Fire action hook after payment failed
        Hook::doAction('payment.failed', $payment, $errorMessage);

        return $payment;
    }

    /**
     * Refund a payment
     */
    public function refundPayment(Payment $payment, ?float $amount = null, ?string $reason = null): Payment
    {
        if ($payment->status !== 'completed') {
            throw new \Exception('Only completed payments can be refunded');
        }

        $refundAmount = $amount ?? $payment->amount;

        if ($refundAmount > $payment->amount) {
            throw new \Exception('Refund amount cannot exceed payment amount');
        }

        try {
            if ($payment->payment_gateway === 'stripe') {
                $this->refundStripePayment($payment, $refundAmount, $reason);
            } elseif ($payment->payment_gateway === 'paypal') {
                $this->refundPayPalPayment($payment, $refundAmount, $reason);
            } else {
                throw new \Exception('Unsupported payment gateway for refunds');
            }

            $payment->update([
                'status' => 'refunded',
                'refunded_amount' => $refundAmount,
                'refunded_at' => now(),
            ]);

            // Fire action hook after payment refunded
            Hook::doAction('payment.refunded', $payment, $refundAmount, $reason);

            return $payment;

        } catch (\Exception $e) {
            throw new \Exception('Refund failed: '.$e->getMessage());
        }
    }

    /**
     * Refund Stripe payment
     */
    protected function refundStripePayment(Payment $payment, float $amount, ?string $reason): void
    {
        $stripeKey = config('services.stripe.secret') ?? '';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$stripeKey,
        ])->asForm()->post('https://api.stripe.com/v1/refunds', [
            'payment_intent' => $payment->gateway_transaction_id,
            'amount' => (int) ($amount * 100),
            'reason' => $reason ?? 'requested_by_customer',
        ]);

        if (! $response->successful()) {
            throw new \Exception('Stripe refund failed: '.$response->body());
        }
    }

    /**
     * Refund PayPal payment
     */
    protected function refundPayPalPayment(Payment $payment, float $amount, ?string $reason): void
    {
        $clientId = config('services.paypal.client_id') ?? '';
        $secret = config('services.paypal.secret') ?? '';
        $mode = config('services.paypal.mode', 'sandbox');

        $baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        // Get access token
        $tokenResponse = Http::withBasicAuth($clientId, $secret)
            ->asForm()
            ->post("{$baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        $accessToken = $tokenResponse->json()['access_token'];

        // Refund capture
        $response = Http::withToken($accessToken)
            ->post("{$baseUrl}/v2/payments/captures/{$payment->gateway_transaction_id}/refund", [
                'amount' => [
                    'currency_code' => $payment->currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'note_to_payer' => $reason ?? 'Refund processed',
            ]);

        if (! $response->successful()) {
            throw new \Exception('PayPal refund failed: '.$response->body());
        }
    }

    /**
     * Handle post-payment actions
     */
    protected function handlePostPaymentActions(Payment $payment): void
    {
        // Update related model status based on payment type.
        switch ($payment->payment_type) {
            case 'submission_fee':
                break;

            case 'publication_charge':
                break;

            case 'subscription_fee':
                if ($payment->subscription) {
                    $payment->subscription->update(['status' => 'active']);
                }
                break;
        }

        // Send payment confirmation email and receipt.
        $payment->load(['manuscript', 'subscription']);
        $user = $payment->user ?? User::find($payment->user_id);
        if ($user) {
            $user->notify(new PaymentConfirmation($payment));
        }
    }

    /**
     * Generate unique transaction ID
     */
    protected function generateTransactionId(): string
    {
        return 'TXN-'.strtoupper(Str::random(12)).'-'.time();
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStats(): array
    {
        $stats = [
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'completed_payments' => Payment::where('status', 'completed')->count(),
            'failed_payments' => Payment::where('status', 'failed')->count(),
            'refunded_amount' => Payment::where('status', 'refunded')->sum('refunded_amount'),
        ];

        // Allow plugins to add custom payment statistics
        return Hook::applyFilters('payment.statistics', $stats);
    }
}
