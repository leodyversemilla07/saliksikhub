<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\SubscriptionType;
use App\Models\User;
use App\Services\SubscriptionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService
    ) {}

    /**
     * Display subscription dashboard
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Subscription::class);

        $query = Subscription::with(['user', 'subscriptionType'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $subscriptions = $query->paginate(20);

        $stats = $this->subscriptionService->getSubscriptionStats();

        return Inertia::render('subscriptions/index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Show subscription details
     */
    public function show(Subscription $subscription): Response
    {
        $this->authorize('view', $subscription);

        $subscription->load(['user', 'subscriptionType', 'payment']);

        return Inertia::render('subscriptions/show', [
            'subscription' => [
                'id' => $subscription->id,
                'status' => $subscription->status,
                'start_date' => $subscription->date_start,
                'end_date' => $subscription->date_end,
                'auto_renew' => $subscription->auto_renew,
                'ip_ranges' => $subscription->ip_ranges,
                'renewal_reminder_sent_at' => $subscription->renewal_reminder_sent_at,
                'created_at' => $subscription->created_at,
                'is_active' => $subscription->isActive(),
                'days_until_expiry' => $subscription->daysUntilExpiration(),
                'user' => [
                    'id' => $subscription->user->id,
                    'name' => $subscription->user->name,
                    'email' => $subscription->user->email,
                ],
                'type' => [
                    'id' => $subscription->subscriptionType->id,
                    'name' => $subscription->subscriptionType->name,
                    'description' => $subscription->subscriptionType->description,
                    'price' => $subscription->subscriptionType->cost,
                    'currency' => $subscription->subscriptionType->currency,
                    'duration_months' => $subscription->subscriptionType->duration_months,
                ],
            ],
        ]);
    }

    /**
     * Show create subscription form
     */
    public function create(): Response
    {
        $this->authorize('create', Subscription::class);

        $types = SubscriptionType::where('is_active', true)->get();

        return Inertia::render('subscriptions/create', [
            'subscriptionTypes' => $types,
        ]);
    }

    /**
     * Store new subscription
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Subscription::class);

        $validated = $request->validate([
            'subscription_type_id' => 'required|exists:subscription_types,id',
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'auto_renew' => 'boolean',
            'ip_ranges' => 'nullable|array',
            'ip_ranges.*' => 'string',
        ]);

        $type = SubscriptionType::findOrFail($validated['subscription_type_id']);
        $user = User::findOrFail($validated['user_id']);

        $subscription = $this->subscriptionService->createSubscription(
            $type,
            $user,
            Carbon::parse($validated['start_date']),
            isset($validated['end_date']) ? Carbon::parse($validated['end_date']) : null,
            $validated['auto_renew'] ?? false,
            $validated['ip_ranges'] ?? null
        );

        return redirect()
            ->route('subscriptions.show', $subscription)
            ->with('success', 'Subscription created successfully.');
    }

    /**
     * Renew subscription
     */
    public function renew(Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        try {
            $this->subscriptionService->renewSubscription($subscription);

            return redirect()
                ->route('subscriptions.show', $subscription)
                ->with('success', 'Subscription renewed successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancel subscription
     */
    public function cancel(Request $request, Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        $immediate = $request->input('immediate', false);

        $this->subscriptionService->cancelSubscription($subscription, $immediate);

        return redirect()
            ->route('subscriptions.show', $subscription)
            ->with('success', $immediate ? 'Subscription cancelled immediately.' : 'Subscription will be cancelled at end of period.');
    }

    /**
     * Suspend subscription
     */
    public function suspend(Request $request, Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        $this->subscriptionService->suspendSubscription($subscription);

        return redirect()
            ->route('subscriptions.show', $subscription)
            ->with('success', 'Subscription suspended.');
    }

    /**
     * Reactivate subscription
     */
    public function reactivate(Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        try {
            $this->subscriptionService->reactivateSubscription($subscription);

            return redirect()
                ->route('subscriptions.show', $subscription)
                ->with('success', 'Subscription reactivated.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Add IP range
     */
    public function addIpRange(Request $request, Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        $validated = $request->validate([
            'ip_range' => 'required|string',
        ]);

        try {
            $this->subscriptionService->addIpRange($subscription, $validated['ip_range']);

            return redirect()
                ->route('subscriptions.show', $subscription)
                ->with('success', 'IP range added successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['ip_range' => $e->getMessage()]);
        }
    }

    /**
     * Remove IP range
     */
    public function removeIpRange(Request $request, Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        $validated = $request->validate([
            'ip_range' => 'required|string',
        ]);

        $this->subscriptionService->removeIpRange($subscription, $validated['ip_range']);

        return redirect()
            ->route('subscriptions.show', $subscription)
            ->with('success', 'IP range removed successfully.');
    }

    /**
     * Subscription types management
     */
    public function types(): Response
    {
        $this->authorize('viewAny', SubscriptionType::class);

        $types = SubscriptionType::withCount('subscriptions')->get();

        return Inertia::render('subscriptions/types/index', [
            'types' => $types,
        ]);
    }

    /**
     * Create subscription type
     */
    public function storeType(Request $request): RedirectResponse
    {
        $this->authorize('create', SubscriptionType::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'duration_months' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $type = $this->subscriptionService->createSubscriptionType($validated);

        return redirect()
            ->route('subscriptions.types')
            ->with('success', 'Subscription type created successfully.');
    }

    /**
     * Update subscription type
     */
    public function updateType(Request $request, SubscriptionType $type): RedirectResponse
    {
        $this->authorize('update', $type);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'duration_months' => 'sometimes|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $this->subscriptionService->updateSubscriptionType($type, $validated);

        return redirect()
            ->route('subscriptions.types')
            ->with('success', 'Subscription type updated successfully.');
    }

    /**
     * Delete subscription type
     */
    public function destroyType(SubscriptionType $type): RedirectResponse
    {
        $this->authorize('delete', $type);

        try {
            $this->subscriptionService->deleteSubscriptionType($type);

            return redirect()
                ->route('subscriptions.types')
                ->with('success', 'Subscription type deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
