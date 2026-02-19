<?php

namespace Database\Factories;

use App\Models\PlatformSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlatformSetting>
 */
class PlatformSettingFactory extends Factory
{
    protected $model = PlatformSetting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'platform_name' => 'Research Platform',
            'platform_tagline' => 'Open Access Research Journal Management',
            'platform_description' => 'A comprehensive platform for managing academic research journals.',
            'admin_email' => 'admin@example.com',
            'settings' => PlatformSetting::getDefaultSettings(),
        ];
    }

    /**
     * Custom branding state.
     */
    public function withBranding(string $name, string $tagline): static
    {
        return $this->state(fn () => [
            'platform_name' => $name,
            'platform_tagline' => $tagline,
        ]);
    }

    /**
     * Closed registration state.
     */
    public function closedRegistration(): static
    {
        return $this->state(fn () => [
            'settings' => array_replace_recursive(
                PlatformSetting::getDefaultSettings(),
                ['registration' => ['open_registration' => false]]
            ),
        ]);
    }
}
