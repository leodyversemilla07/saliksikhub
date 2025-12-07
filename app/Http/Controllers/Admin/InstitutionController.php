<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInstitutionRequest;
use App\Http\Requests\Admin\UpdateInstitutionRequest;
use App\Models\Institution;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionController extends Controller
{
    /**
     * Display a listing of institutions.
     */
    public function index(): Response
    {
        $institutions = Institution::query()
            ->withCount('journals')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('admin/institutions/index', [
            'institutions' => $institutions,
        ]);
    }

    /**
     * Show the form for creating a new institution.
     */
    public function create(): Response
    {
        return Inertia::render('admin/institutions/create');
    }

    /**
     * Store a newly created institution.
     */
    public function store(StoreInstitutionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('institutions/logos', 'public');
        }

        Institution::create($data);

        return redirect()
            ->route('admin.institutions.index')
            ->with('success', 'Institution created successfully.');
    }

    /**
     * Display the specified institution.
     */
    public function show(Institution $institution): Response
    {
        $institution->load(['journals' => fn ($q) => $q->withCount('manuscripts')]);

        return Inertia::render('admin/institutions/show', [
            'institution' => $institution,
        ]);
    }

    /**
     * Show the form for editing the specified institution.
     */
    public function edit(Institution $institution): Response
    {
        return Inertia::render('admin/institutions/edit', [
            'institution' => $institution,
        ]);
    }

    /**
     * Update the specified institution.
     */
    public function update(UpdateInstitutionRequest $request, Institution $institution): RedirectResponse
    {
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($institution->logo_path) {
                Storage::disk('public')->delete($institution->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('institutions/logos', 'public');
        }

        $institution->update($data);

        return redirect()
            ->route('admin.institutions.index')
            ->with('success', 'Institution updated successfully.');
    }

    /**
     * Remove the specified institution.
     */
    public function destroy(Institution $institution): RedirectResponse
    {
        // Check for associated journals
        if ($institution->journals()->exists()) {
            return back()->with('error', 'Cannot delete institution with associated journals.');
        }

        // Delete logo
        if ($institution->logo_path) {
            Storage::disk('public')->delete($institution->logo_path);
        }

        $institution->delete();

        return redirect()
            ->route('admin.institutions.index')
            ->with('success', 'Institution deleted successfully.');
    }
}
