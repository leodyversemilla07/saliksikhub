<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;
        $institution = app()->bound('currentInstitution') ? app('currentInstitution') : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user() ? $request->user()->role : null,
            ],
            'currentJournal' => $journal ? [
                'id' => $journal->id,
                'name' => $journal->name,
                'slug' => $journal->slug,
                'abbreviation' => $journal->abbreviation,
                'description' => $journal->description,
                'issn' => $journal->issn,
                'eissn' => $journal->eissn,
                'logo_path' => $journal->logo_path,
                'logo_url' => $journal->logo_path ? asset('storage/'.$journal->logo_path) : null,
                'settings' => $journal->settings,
                'theme_settings' => $journal->merged_theme_settings,
            ] : null,
            'currentInstitution' => $institution ? [
                'id' => $institution->id,
                'name' => $institution->name,
                'slug' => $institution->slug,
                'abbreviation' => $institution->abbreviation,
                'logo_path' => $institution->logo_path,
                'logo_url' => $institution->logo_path ? asset('storage/'.$institution->logo_path) : null,
                'website' => $institution->website,
                'contact_email' => $institution->contact_email,
            ] : null,
        ];
    }
}
