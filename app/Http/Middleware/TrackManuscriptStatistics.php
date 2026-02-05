<?php

namespace App\Http\Middleware;

use App\Models\Manuscript;
use App\Services\StatisticsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackManuscriptStatistics
{
    public function __construct(
        protected StatisticsService $statisticsService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track successful GET requests
        if ($request->isMethod('GET') && $response->getStatusCode() === 200) {
            $this->trackView($request);
        }

        return $response;
    }

    /**
     * Track the view based on the route
     */
    protected function trackView(Request $request): void
    {
        $route = $request->route();
        
        if (!$route) {
            return;
        }

        $routeName = $route->getName();
        $manuscript = $this->getManuscriptFromRoute($route);

        if (!$manuscript) {
            return;
        }

        // Generate session ID for COUNTER compliance
        $sessionId = $this->getOrCreateSessionId($request);

        // Track based on route type
        if ($this->isInvestigation($routeName)) {
            $this->statisticsService->recordInvestigation(
                $manuscript,
                $request->ip(),
                $request->userAgent() ?? 'Unknown',
                $sessionId
            );
        } elseif ($this->isRequest($routeName)) {
            $galleyId = $route->parameter('galley')?->id ?? null;
            
            $this->statisticsService->recordRequest(
                $manuscript,
                $request->ip(),
                $request->userAgent() ?? 'Unknown',
                $sessionId,
                $galleyId
            );
        }
    }

    /**
     * Get manuscript from route parameters
     */
    protected function getManuscriptFromRoute($route): ?Manuscript
    {
        // Direct manuscript parameter
        if ($manuscript = $route->parameter('manuscript')) {
            return $manuscript instanceof Manuscript ? $manuscript : null;
        }

        // Manuscript through galley
        if ($galley = $route->parameter('galley')) {
            return $galley->publication?->manuscript;
        }

        // Manuscript through publication
        if ($publication = $route->parameter('publication')) {
            return $publication->manuscript;
        }

        return null;
    }

    /**
     * Check if route is an investigation (abstract/landing page view)
     */
    protected function isInvestigation(string $routeName): bool
    {
        $investigationRoutes = [
            'manuscripts.public.show',
            'manuscripts.show',
        ];

        return in_array($routeName, $investigationRoutes);
    }

    /**
     * Check if route is a request (full-text download)
     */
    protected function isRequest(string $routeName): bool
    {
        $requestRoutes = [
            'manuscripts.pdf',
            'galleys.view',
            'galleys.download',
        ];

        return in_array($routeName, $requestRoutes);
    }

    /**
     * Get or create session ID for tracking
     */
    protected function getOrCreateSessionId(Request $request): string
    {
        // Use Laravel session ID if available
        if ($request->hasSession()) {
            return $request->session()->getId();
        }

        // Fallback to IP + User Agent hash
        return hash('sha256', $request->ip() . $request->userAgent());
    }
}
