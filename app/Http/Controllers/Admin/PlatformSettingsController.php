<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePlatformSettingsRequest;
use App\Models\PlatformSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PlatformSettingsController extends Controller
{
    /**
     * Show the platform settings form.
     */
    public function edit(): Response
    {
        $platformSettings = PlatformSetting::instance();

        return Inertia::render('admin/platform-settings/edit', [
            'platformSettings' => [
                'id' => $platformSettings->id,
                'platform_name' => $platformSettings->platform_name,
                'platform_tagline' => $platformSettings->platform_tagline,
                'platform_description' => $platformSettings->platform_description,
                'logo_path' => $platformSettings->logo_path,
                'logo_url' => $platformSettings->logo_url,
                'favicon_path' => $platformSettings->favicon_path,
                'favicon_url' => $platformSettings->favicon_url,
                'admin_email' => $platformSettings->admin_email,
                'settings' => $platformSettings->merged_settings,
            ],
            'settingsSchema' => PlatformSetting::getSettingsSchema(),
        ]);
    }

    /**
     * Update the platform settings.
     */
    public function update(UpdatePlatformSettingsRequest $request): RedirectResponse
    {
        $platformSettings = PlatformSetting::instance();
        $validated = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($platformSettings->logo_path) {
                Storage::disk('public')->delete($platformSettings->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('platform', 'public');
        }

        // Handle favicon upload
        if ($request->hasFile('favicon')) {
            if ($platformSettings->favicon_path) {
                Storage::disk('public')->delete($platformSettings->favicon_path);
            }
            $validated['favicon_path'] = $request->file('favicon')->store('platform', 'public');
        }

        // Merge settings with existing
        if (isset($validated['settings'])) {
            $currentSettings = $platformSettings->settings ?? [];
            $validated['settings'] = array_replace_recursive($currentSettings, $validated['settings']);
        }

        // Remove file inputs from validated data (already handled above)
        unset($validated['logo'], $validated['favicon']);

        $platformSettings->update($validated);

        return back()->with('success', 'Platform settings updated successfully.');
    }

    /**
     * Remove the platform logo.
     */
    public function removeLogo(): RedirectResponse
    {
        $platformSettings = PlatformSetting::instance();

        if ($platformSettings->logo_path) {
            Storage::disk('public')->delete($platformSettings->logo_path);
            $platformSettings->update(['logo_path' => null]);
        }

        return back()->with('success', 'Platform logo removed.');
    }

    /**
     * Remove the platform favicon.
     */
    public function removeFavicon(): RedirectResponse
    {
        $platformSettings = PlatformSetting::instance();

        if ($platformSettings->favicon_path) {
            Storage::disk('public')->delete($platformSettings->favicon_path);
            $platformSettings->update(['favicon_path' => null]);
        }

        return back()->with('success', 'Platform favicon removed.');
    }

    /**
     * Reset platform settings to defaults.
     */
    public function reset(): RedirectResponse
    {
        $platformSettings = PlatformSetting::instance();

        $platformSettings->update([
            'settings' => PlatformSetting::getDefaultSettings(),
        ]);

        return back()->with('success', 'Platform settings reset to defaults.');
    }
}
