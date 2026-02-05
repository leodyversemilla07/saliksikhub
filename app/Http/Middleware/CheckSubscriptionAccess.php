<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use App\Services\SubscriptionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionAccess
{
    public function __construct(
        protected SubscriptionService $subscriptionService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for authenticated users with personal access
        if ($request->user()) {
            return $next($request);
        }

        $ipAddress = $request->ip();

        // Check if IP has subscription access
        $hasAccess = $this->checkIpSubscriptionAccess($ipAddress);

        if (!$hasAccess) {
            // Check if the content requires subscription
            // This can be expanded based on your access control logic
            $manuscript = $request->route('manuscript');
            
            if ($manuscript && $this->requiresSubscription($manuscript)) {
                return response()->view('errors.subscription-required', [
                    'message' => 'This content requires a subscription or institutional access.',
                ], 403);
            }
        }

        return $next($request);
    }

    /**
     * Check if IP address has active subscription access
     */
    protected function checkIpSubscriptionAccess(string $ipAddress): bool
    {
        // Get all active subscriptions
        $activeSubscriptions = Subscription::where('status', 'active')
            ->whereNotNull('ip_ranges')
            ->get();

        foreach ($activeSubscriptions as $subscription) {
            if ($this->subscriptionService->checkIpAccess($subscription, $ipAddress)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if manuscript requires subscription
     */
    protected function requiresSubscription($manuscript): bool
    {
        if (!$manuscript) {
            return false;
        }

        // Check manuscript's access status
        $publication = $manuscript->currentPublication;
        
        if (!$publication) {
            return false;
        }

        // Subscription required for non-open access content
        return in_array($publication->access_status, ['subscription', 'restricted']);
    }
}
