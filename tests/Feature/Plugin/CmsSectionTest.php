<?php

use App\Core\Plugin\Hook;
use App\Models\JournalPageSection;
use App\Services\SidebarWidgetService;

beforeEach(function () {
    // Reset hooks
    $reflection = new ReflectionClass(Hook::class);
    foreach (['actions', 'filters'] as $prop) {
        $p = $reflection->getProperty($prop);
        $p->setAccessible(true);
        $p->setValue([]);
    }
});

it('provides default section types', function () {
    $types = JournalPageSection::getTypes();

    expect($types)->toBeArray();
    expect($types)->toHaveKey('hero');
    expect($types)->toHaveKey('text');
    expect($types)->toHaveKey('cards');
    expect($types)->toHaveKey('custom_html');

    expect($types['hero'])->toHaveKeys(['name', 'description', 'icon']);
    expect($types['hero']['name'])->toBe('Hero Banner');
});

it('allows plugins to extend section types via filter', function () {
    Hook::addFilter('cms.section_types', function ($types) {
        $types['custom_plugin_section'] = [
            'name' => 'Plugin Section',
            'description' => 'A custom section type registered by a plugin',
            'icon' => 'Puzzle',
            'plugin' => 'test-plugin',
        ];

        return $types;
    });

    $types = JournalPageSection::getTypes();

    expect($types)->toHaveKey('custom_plugin_section');
    expect($types['custom_plugin_section']['name'])->toBe('Plugin Section');
    expect($types['custom_plugin_section']['plugin'])->toBe('test-plugin');
});

it('preserves built-in types when plugins add new ones', function () {
    Hook::addFilter('cms.section_types', function ($types) {
        $types['plugin_type'] = [
            'name' => 'Plugin Type',
            'description' => 'Added by plugin',
            'icon' => 'Star',
        ];

        return $types;
    });

    $types = JournalPageSection::getTypes();

    expect($types)->toHaveKey('hero');
    expect($types)->toHaveKey('plugin_type');
});

it('allows plugins to modify existing section type definitions', function () {
    Hook::addFilter('cms.section_types', function ($types) {
        $types['hero']['name'] = 'Modified Hero Banner';
        $types['hero']['description'] = 'Modified description';

        return $types;
    });

    $types = JournalPageSection::getTypes();

    expect($types['hero']['name'])->toBe('Modified Hero Banner');
    expect($types['hero']['description'])->toBe('Modified description');
});

it('returns getTypes result when no filters are registered', function () {
    $types = JournalPageSection::getTypes();

    expect($types)->toBe(JournalPageSection::TYPES);
});

it('provides default content for each section type', function () {
    $content = JournalPageSection::getDefaultContent('hero');

    expect($content)->toBeArray();
    expect($content)->toHaveKey('title');
    expect($content)->toHaveKey('subtitle');

    $htmlContent = JournalPageSection::getDefaultContent('custom_html');
    expect($htmlContent)->toHaveKey('html');
});

it('provides default settings for section types', function () {
    $settings = JournalPageSection::getDefaultSettings('hero');

    expect($settings)->toBeArray();
    expect($settings)->toHaveKeys(['background_color', 'text_color', 'padding_top', 'padding_bottom']);
});

it('provides empty defaults for unknown section types', function () {
    $content = JournalPageSection::getDefaultContent('nonexistent_type');

    expect($content)->toBe([]);
});

it('works with sidebar widget types filter', function () {
    Hook::addFilter('sidebar.widget_types', function ($types) {
        $types['custom_widget'] = [
            'name' => 'Custom Widget',
            'description' => 'A widget registered by a plugin',
            'icon' => 'Star',
        ];

        return $types;
    });

    $service = app(SidebarWidgetService::class);
    $types = $service->getAvailableTypes();

    expect($types)->toHaveKey('custom_widget');
    expect($types['custom_widget']['name'])->toBe('Custom Widget');
});
