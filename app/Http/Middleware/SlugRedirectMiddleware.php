<?php

namespace App\Http\Middleware;

use App\Models\Issue;
use App\Models\Manuscript;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SlugRedirectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only handle GET requests for public routes
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        $path = $request->path();
        
        // Handle manuscript ID redirects
        if (preg_match('/^manuscripts\/(\d+)(?:\/pdf)?$/', $path, $matches)) {
            $manuscriptId = $matches[1];
            $isPdf = str_ends_with($path, '/pdf');
            
            try {
                $manuscript = Manuscript::findOrFail($manuscriptId);
                
                if ($manuscript->slug) {
                    $newRoute = $isPdf 
                        ? route('manuscripts.pdf', $manuscript->slug)
                        : route('manuscripts.public.show', $manuscript->slug);
                    
                    Log::info('Redirecting old manuscript URL', [
                        'old_url' => $request->fullUrl(),
                        'new_url' => $newRoute,
                        'manuscript_id' => $manuscriptId,
                        'manuscript_slug' => $manuscript->slug,
                    ]);
                    
                    return redirect($newRoute, 301); // Permanent redirect
                }
            } catch (\Exception $e) {
                // If manuscript not found or any error, continue to next middleware
                Log::warning('Could not redirect manuscript URL', [
                    'url' => $request->fullUrl(),
                    'manuscript_id' => $manuscriptId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        // Handle issue ID redirects
        if (preg_match('/^issues\/(\d+)$/', $path, $matches)) {
            $issueId = $matches[1];
            
            try {
                $issue = Issue::findOrFail($issueId);
                
                if ($issue->slug) {
                    $newRoute = url("/issues/{$issue->slug}");
                    
                    Log::info('Redirecting old issue URL', [
                        'old_url' => $request->fullUrl(),
                        'new_url' => $newRoute,
                        'issue_id' => $issueId,
                        'issue_slug' => $issue->slug,
                    ]);
                    
                    return redirect($newRoute, 301); // Permanent redirect
                }
            } catch (\Exception $e) {
                // If issue not found or any error, continue to next middleware
                Log::warning('Could not redirect issue URL', [
                    'url' => $request->fullUrl(),
                    'issue_id' => $issueId,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $next($request);
    }
}
