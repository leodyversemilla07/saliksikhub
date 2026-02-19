<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use Illuminate\Database\Seeder;

class PlatformSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PlatformSetting::firstOrCreate([], [
            'platform_name' => 'Research Platform',
            'platform_tagline' => 'Open Access Research Journal Management',
            'platform_description' => 'A comprehensive, open-source platform for managing academic research journals. Supports multiple journals, peer review workflows, and scholarly publishing.',
            'admin_email' => 'admin@example.com',
            'settings' => PlatformSetting::getDefaultSettings(),
        ]);
    }
}
