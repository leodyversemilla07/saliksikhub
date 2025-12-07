<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JournalThemeController extends Controller
{
    /**
     * Display the theme settings page.
     */
    public function edit(Journal $journal)
    {
        return Inertia::render('admin/cms/theme/edit', [
            'journal' => $journal,
            'themeSettings' => $journal->merged_theme_settings,
            'defaultSettings' => Journal::getDefaultThemeSettings(),
            'fonts' => [
                'Inter',
                'Roboto',
                'Open Sans',
                'Lato',
                'Montserrat',
                'Source Sans Pro',
                'Poppins',
                'Nunito',
                'Raleway',
                'PT Sans',
                'Merriweather',
                'Playfair Display',
                'Lora',
                'Source Serif Pro',
                'Georgia',
                'Times New Roman',
                'Arial',
                'Helvetica',
                'system-ui',
            ],
            'headerStyles' => [
                'default' => 'Default (Logo + Navigation)',
                'centered' => 'Centered (Logo centered)',
                'minimal' => 'Minimal (Text only)',
            ],
            'footerStyles' => [
                'default' => 'Default (Multi-column)',
                'minimal' => 'Minimal (Single line)',
                'expanded' => 'Expanded (With contact info)',
            ],
        ]);
    }

    /**
     * Update the theme settings.
     */
    public function update(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'colors' => 'sometimes|array',
            'colors.primary' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.primary_foreground' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.secondary' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.secondary_foreground' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.accent' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.background' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.foreground' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.muted' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.muted_foreground' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'colors.border' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'typography' => 'sometimes|array',
            'typography.font_family' => 'sometimes|string|max:100',
            'typography.heading_font' => 'sometimes|string|max:100',
            'typography.base_size' => 'sometimes|string|max:20',
            'layout' => 'sometimes|array',
            'layout.header_style' => 'sometimes|in:default,centered,minimal',
            'layout.footer_style' => 'sometimes|in:default,minimal,expanded',
            'layout.max_width' => 'sometimes|string|max:20',
            'branding' => 'sometimes|array',
            'branding.show_institution_logo' => 'sometimes|boolean',
            'branding.show_journal_name' => 'sometimes|boolean',
        ]);

        // Merge with existing settings
        $currentSettings = $journal->theme_settings ?? [];
        $newSettings = array_replace_recursive($currentSettings, $validated);

        $journal->update(['theme_settings' => $newSettings]);

        return back()->with('success', 'Theme settings updated successfully.');
    }

    /**
     * Upload a favicon.
     */
    public function uploadFavicon(Request $request, Journal $journal)
    {
        $request->validate([
            'favicon' => 'required|image|mimes:ico,png,svg|max:512',
        ]);

        // Delete old favicon if exists
        $currentFavicon = $journal->getThemeSetting('branding.favicon');
        if ($currentFavicon) {
            Storage::disk('public')->delete($currentFavicon);
        }

        // Store new favicon
        $path = $request->file('favicon')->store(
            "journals/{$journal->id}/branding",
            'public'
        );

        // Update theme settings
        $themeSettings = $journal->theme_settings ?? [];
        $themeSettings['branding']['favicon'] = $path;
        $journal->update(['theme_settings' => $themeSettings]);

        return back()->with('success', 'Favicon uploaded successfully.');
    }

    /**
     * Reset theme to defaults.
     */
    public function reset(Journal $journal)
    {
        $journal->update(['theme_settings' => null]);

        return back()->with('success', 'Theme settings reset to defaults.');
    }

    /**
     * Preview the theme (returns CSS variables).
     */
    public function preview(Journal $journal)
    {
        $settings = $journal->merged_theme_settings;

        $css = $this->generateCssVariables($settings);

        return response($css, 200)
            ->header('Content-Type', 'text/css');
    }

    /**
     * Generate CSS variables from theme settings.
     */
    protected function generateCssVariables(array $settings): string
    {
        $colors = $settings['colors'] ?? [];

        $css = ":root {\n";

        // Color variables
        foreach ($colors as $name => $value) {
            $varName = str_replace('_', '-', $name);
            // Convert hex to HSL for Tailwind compatibility
            $hsl = $this->hexToHsl($value);
            $css .= "  --{$varName}: {$hsl};\n";
        }

        // Typography
        $typography = $settings['typography'] ?? [];
        if (! empty($typography['font_family'])) {
            $css .= "  --font-sans: '{$typography['font_family']}', system-ui, sans-serif;\n";
        }
        if (! empty($typography['heading_font'])) {
            $css .= "  --font-heading: '{$typography['heading_font']}', system-ui, sans-serif;\n";
        }

        // Layout
        $layout = $settings['layout'] ?? [];
        if (! empty($layout['max_width'])) {
            $css .= "  --max-width: {$layout['max_width']};\n";
        }

        $css .= "}\n";

        return $css;
    }

    /**
     * Convert hex color to HSL string.
     */
    protected function hexToHsl(string $hex): string
    {
        $hex = ltrim($hex, '#');

        $r = hexdec(substr($hex, 0, 2)) / 255;
        $g = hexdec(substr($hex, 2, 2)) / 255;
        $b = hexdec(substr($hex, 4, 2)) / 255;

        $max = max($r, $g, $b);
        $min = min($r, $g, $b);

        $l = ($max + $min) / 2;

        if ($max === $min) {
            $h = $s = 0;
        } else {
            $d = $max - $min;
            $s = $l > 0.5 ? $d / (2 - $max - $min) : $d / ($max + $min);

            switch ($max) {
                case $r:
                    $h = (($g - $b) / $d + ($g < $b ? 6 : 0)) / 6;
                    break;
                case $g:
                    $h = (($b - $r) / $d + 2) / 6;
                    break;
                case $b:
                    $h = (($r - $g) / $d + 4) / 6;
                    break;
            }
        }

        $h = round($h * 360);
        $s = round($s * 100);
        $l = round($l * 100);

        return "{$h} {$s}% {$l}%";
    }
}
