<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Display payment dashboard
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Payment::class);

        $query = Payment::with(['user', 'manuscript', 'subscription'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('payment_type', $request->input('type'));
        }

        $payments = $query->paginate(20);

        $stats = $this->paymentService->getPaymentStats();

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Show payment details
     */
    public function show(Payment $payment): Response
    {
        $this->authorize('view', $payment);

        $payment->load(['user', 'manuscript', 'subscription']);

        return Inertia::render('payments/show', [
            'payment' => [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'type' => $payment->payment_type,
                'status' => $payment->status,
                'gateway' => $payment->payment_gateway,
                'gateway_transaction_id' => $payment->gateway_transaction_id,
                'paid_at' => $payment->paid_at,
                'refunded_amount' => $payment->refunded_amount,
                'refunded_at' => $payment->refunded_at,
                'created_at' => $payment->created_at,
                'user' => [
                    'id' => $payment->user->id,
                    'name' => $payment->user->name,
                    'email' => $payment->user->email,
                ],
                'payable' => $this->formatPayable($payment),
            ],
        ]);
    }

    /**
     * Show payment form for submission fee
     */
    public function submissionFee(Manuscript $manuscript): Response
    {
        $this->authorize('update', $manuscript);

        // Check if already paid
        $existingPayment = Payment::where('manuscript_id', $manuscript->id)
            ->where('payment_type', 'submission_fee')
            ->where('status', 'completed')
            ->first();

        if ($existingPayment) {
            return redirect()
                ->route('manuscripts.show', $manuscript)
                ->with('info', 'Submission fee already paid.');
        }

        $amount = config('services.fees.submission', 50.00);

        return Inertia::render('payments/submission-fee', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'slug' => $manuscript->slug,
            ],
            'amount' => $amount,
            'currency' => 'USD',
            'stripeKey' => config('services.stripe.key'),
            'paypalClientId' => config('services.paypal.client_id'),
        ]);
    }

    /**
     * Process submission fee payment
     */
    public function processSubmissionFee(Request $request, Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'gateway' => 'required|string|in:stripe,paypal',
            'payment_method_id' => 'required_if:gateway,stripe|string',
        ]);

        $amount = config('services.fees.submission', 50.00);

        try {
            // Create payment record
            $payment = $this->paymentService->createSubmissionFee(
                $manuscript,
                auth()->id(),
                $amount
            );

            // Process payment
            if ($validated['gateway'] === 'stripe') {
                $result = $this->paymentService->processWithStripe($payment, [
                    'payment_method_id' => $validated['payment_method_id'],
                ]);

                if ($result['success']) {
                    return redirect()
                        ->route('payments.show', $payment)
                        ->with('success', 'Payment completed successfully!');
                }

                if ($result['requires_action'] ?? false) {
                    return back()->with([
                        'requires_action' => true,
                        'client_secret' => $result['client_secret'],
                    ]);
                }

                return back()->withErrors(['payment' => 'Payment failed. Please try again.']);

            } elseif ($validated['gateway'] === 'paypal') {
                $result = $this->paymentService->processWithPayPal($payment);

                if ($result['requires_redirect']) {
                    return redirect($result['approval_url']);
                }
            }

            return back()->withErrors(['payment' => 'Payment gateway not supported']);

        } catch (\Exception $e) {
            return back()->withErrors(['payment' => $e->getMessage()]);
        }
    }

    /**
     * Show payment form for publication charge
     */
    public function publicationCharge(Manuscript $manuscript): Response
    {
        $this->authorize('update', $manuscript);

        // Check if already paid
        $existingPayment = Payment::where('manuscript_id', $manuscript->id)
            ->where('payment_type', 'publication_charge')
            ->where('status', 'completed')
            ->first();

        if ($existingPayment) {
            return redirect()
                ->route('manuscripts.show', $manuscript)
                ->with('info', 'Publication charge already paid.');
        }

        $amount = config('services.fees.publication', 100.00);

        return Inertia::render('payments/publication-charge', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'slug' => $manuscript->slug,
            ],
            'amount' => $amount,
            'currency' => 'USD',
            'stripeKey' => config('services.stripe.key'),
            'paypalClientId' => config('services.paypal.client_id'),
        ]);
    }

    /**
     * Process publication charge payment
     */
    public function processPublicationCharge(Request $request, Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'gateway' => 'required|string|in:stripe,paypal',
            'payment_method_id' => 'required_if:gateway,stripe|string',
        ]);

        $amount = config('services.fees.publication', 100.00);

        try {
            // Create payment record
            $payment = $this->paymentService->createPublicationCharge(
                $manuscript,
                auth()->id(),
                $amount
            );

            // Process payment
            if ($validated['gateway'] === 'stripe') {
                $result = $this->paymentService->processWithStripe($payment, [
                    'payment_method_id' => $validated['payment_method_id'],
                ]);

                if ($result['success']) {
                    return redirect()
                        ->route('payments.show', $payment)
                        ->with('success', 'Payment completed successfully!');
                }

                return back()->withErrors(['payment' => 'Payment failed. Please try again.']);

            } elseif ($validated['gateway'] === 'paypal') {
                $result = $this->paymentService->processWithPayPal($payment);

                if ($result['requires_redirect']) {
                    return redirect($result['approval_url']);
                }
            }

            return back()->withErrors(['payment' => 'Payment gateway not supported']);

        } catch (\Exception $e) {
            return back()->withErrors(['payment' => $e->getMessage()]);
        }
    }

    /**
     * Handle payment return from gateway
     */
    public function return(Request $request): RedirectResponse
    {
        // PayPal return
        if ($request->has('token')) {
            $orderId = $request->input('token');

            $payment = Payment::where('gateway_transaction_id', $orderId)
                ->where('payment_gateway', 'paypal')
                ->firstOrFail();

            try {
                $result = $this->paymentService->capturePayPalPayment($payment, $orderId);

                if ($result['success']) {
                    return redirect()
                        ->route('payments.show', $payment)
                        ->with('success', 'Payment completed successfully!');
                }

                return redirect()
                    ->route('payments.show', $payment)
                    ->withErrors(['payment' => 'Payment capture failed.']);

            } catch (\Exception $e) {
                return redirect()
                    ->route('payments.show', $payment)
                    ->withErrors(['payment' => $e->getMessage()]);
            }
        }

        // Stripe return (if using redirect flow)
        if ($request->has('payment_intent')) {
            $paymentIntentId = $request->input('payment_intent');

            $payment = Payment::where('gateway_transaction_id', $paymentIntentId)
                ->where('payment_gateway', 'stripe')
                ->firstOrFail();

            return redirect()
                ->route('payments.show', $payment)
                ->with('success', 'Payment completed successfully!');
        }

        return redirect()->route('dashboard');
    }

    /**
     * Handle payment cancellation
     */
    public function cancel(Request $request): RedirectResponse
    {
        return redirect()
            ->route('dashboard')
            ->with('info', 'Payment was cancelled.');
    }

    /**
     * Refund a payment
     */
    public function refund(Request $request, Payment $payment): RedirectResponse
    {
        $this->authorize('refund', $payment);

        $validated = $request->validate([
            'amount' => 'nullable|numeric|min:0.01|max:'.$payment->amount,
            'reason' => 'nullable|string|max:500',
        ]);

        try {
            $this->paymentService->refundPayment(
                $payment,
                $validated['amount'] ?? null,
                $validated['reason'] ?? null
            );

            return redirect()
                ->route('payments.show', $payment)
                ->with('success', 'Payment refunded successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['refund' => $e->getMessage()]);
        }
    }

    /**
     * Webhook handler for Stripe
     */
    public function stripeWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        // Verify webhook signature (simplified - use Stripe SDK in production)
        // This is a placeholder for proper webhook verification

        $event = json_decode($payload, true);

        if ($event['type'] === 'payment_intent.succeeded') {
            $paymentIntent = $event['data']['object'];

            $payment = Payment::where('gateway_transaction_id', $paymentIntent['id'])->first();

            if ($payment && $payment->status !== 'completed') {
                $this->paymentService->markAsCompleted($payment, $paymentIntent['id']);
            }
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Webhook handler for PayPal
     */
    public function paypalWebhook(Request $request): JsonResponse
    {
        // Verify webhook signature (use PayPal SDK in production)
        $event = $request->all();

        if ($event['event_type'] === 'PAYMENT.CAPTURE.COMPLETED') {
            $resource = $event['resource'];

            $payment = Payment::where('gateway_transaction_id', $resource['id'])->first();

            if ($payment && $payment->status !== 'completed') {
                $this->paymentService->markAsCompleted($payment, $resource['id']);
            }
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Format payable model for response
     */
    protected function formatPayable(Payment $payment): ?array
    {
        if ($payment->manuscript instanceof Manuscript) {
            return [
                'type' => 'manuscript',
                'id' => $payment->manuscript->id,
                'title' => $payment->manuscript->title,
                'slug' => $payment->manuscript->slug,
            ];
        }

        if ($payment->subscription) {
            return [
                'type' => 'subscription',
                'id' => $payment->subscription->id,
            ];
        }

        return null;
    }
}
