<?php

use App\Core\Plugin\Hook;
use App\Core\Plugin\PluginManager;
use App\Models\Journal;
use App\Models\Plugin;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses()->group('plugins');
uses(RefreshDatabase::class);

beforeEach(function () {
    Hook::clearAll();
});

afterEach(function () {
    Hook::clearAll();
});

describe('Hook System', function () {
    it('can register and trigger actions', function () {
        $called = false;
        $receivedArgs = [];
        
        Hook::addAction('test.action', function (...$args) use (&$called, &$receivedArgs) {
            $called = true;
            $receivedArgs = $args;
        });
        
        Hook::doAction('test.action', 'arg1', 'arg2');
        
        expect($called)->toBeTrue();
        expect($receivedArgs)->toEqual(['arg1', 'arg2']);
    });

    it('can register and apply filters', function () {
        Hook::addFilter('test.filter', function ($value) {
            return $value . '_modified';
        });
        
        $result = Hook::applyFilters('test.filter', 'original');
        
        expect($result)->toBe('original_modified');
    });

    it('applies multiple filters in priority order', function () {
        Hook::addFilter('test.priority', function ($value) {
            return $value . '_second';
        }, 20);
        
        Hook::addFilter('test.priority', function ($value) {
            return $value . '_first';
        }, 10);
        
        $result = Hook::applyFilters('test.priority', 'start');
        
        expect($result)->toBe('start_first_second');
    });

    it('returns original value when no filters registered', function () {
        $result = Hook::applyFilters('nonexistent.filter', 'original');
        
        expect($result)->toBe('original');
    });

    it('can remove registered actions', function () {
        $callback = function () {
            throw new Exception('Should not be called');
        };
        
        Hook::addAction('test.remove', $callback);
        Hook::removeAction('test.remove', $callback);
        
        // Should not throw
        Hook::doAction('test.remove');
        
        expect(true)->toBeTrue();
    });
});

describe('Plugin Model', function () {
    it('can create a plugin record', function () {
        $plugin = Plugin::create([
            'name' => 'test-plugin',
            'display_name' => 'Test Plugin',
            'version' => '1.0.0',
            'author' => 'Test Author',
            'description' => 'A test plugin',
            'path' => '/path/to/plugin',
            'is_global' => false,
            'enabled' => false,
            'settings' => ['key' => 'value'],
        ]);
        
        expect($plugin->id)->toBeInt();
        expect($plugin->name)->toBe('test-plugin');
        expect($plugin->settings)->toBe(['key' => 'value']);
    });

    it('can check if active for journal', function () {
        $journal = Journal::factory()->create();
        
        $plugin = Plugin::create([
            'name' => 'journal-plugin',
            'display_name' => 'Journal Plugin',
            'version' => '1.0.0',
            'path' => '/path',
            'is_global' => false,
            'enabled' => false,
        ]);
        
        // Not enabled initially
        expect($plugin->isActiveForJournal($journal->id))->toBeFalse();
        
        // Enable for journal
        $plugin->journals()->attach($journal->id, ['enabled' => true]);
        
        expect($plugin->isActiveForJournal($journal->id))->toBeTrue();
    });

    it('global plugins are active for all journals', function () {
        $journal = Journal::factory()->create();
        
        $plugin = Plugin::create([
            'name' => 'global-plugin',
            'display_name' => 'Global Plugin',
            'version' => '1.0.0',
            'path' => '/path',
            'is_global' => true,
            'enabled' => true,
        ]);
        
        expect($plugin->isActiveForJournal($journal->id))->toBeTrue();
    });
});

describe('Plugin Manager', function () {
    it('can install a plugin from directory', function () {
        $pluginManager = app(PluginManager::class);
        
        // Create a temporary plugin directory
        $tempDir = sys_get_temp_dir() . '/test-plugin-' . uniqid();
        mkdir($tempDir);
        file_put_contents($tempDir . '/plugin.json', json_encode([
            'name' => 'temp-test-plugin',
            'displayName' => 'Temp Test Plugin',
            'version' => '1.0.0',
            'author' => 'Test',
        ]));

        // Create a simple plugin class
        mkdir($tempDir . '/src');
        file_put_contents($tempDir . '/src/TempTestPlugin.php', '<?php
            namespace Plugins\\TempTest;
            use App\Core\Plugin\Contracts\PluginInterface;
            class TempTestPlugin implements PluginInterface {
                public function register(): void {}
                public function boot(): void {}
                public function activate(): void {}
                public function deactivate(): void {}
                public function uninstall(): void {}
                public function getInfo(): array { return ["name" => "temp-test-plugin", "version" => "1.0.0", "author" => "Test"]; }
                public function hasSettings(): bool { return false; }
                public function renderSettings(): mixed { return null; }
            }
        ');

        $plugin = $pluginManager->install($tempDir);

        expect($plugin)->toBeInstanceOf(Plugin::class);
        expect($plugin->name)->toBe('temp-test-plugin');

        // Cleanup
        $pluginManager->uninstall($plugin);
    });

    it('can enable and disable plugins', function () {
        $pluginManager = app(PluginManager::class);
        
        $plugin = Plugin::create([
            'name' => 'toggle-test',
            'display_name' => 'Toggle Test',
            'version' => '1.0.0',
            'path' => '/path',
            'enabled' => false,
        ]);

        $pluginManager->enable($plugin);
        
        $plugin->refresh();
        expect($plugin->enabled)->toBeTrue();

        $pluginManager->disable($plugin);
        
        $plugin->refresh();
        expect($plugin->enabled)->toBeFalse();
    });
});

describe('Plugin Integration', function () {
    it('plugins can hook into manuscript submission', function () {
        $called = false;
        
        Hook::addAction('manuscript.submitted', function () use (&$called) {
            $called = true;
        });
        
        // Simulate manuscript submission hook being called
        Hook::doAction('manuscript.submitted', (object)['id' => 1]);
        
        expect($called)->toBeTrue();
    });

    it('multiple plugins can hook into the same action', function () {
        $callOrder = [];
        
        Hook::addAction('multi.hook', function () use (&$callOrder) {
            $callOrder[] = 'first';
        }, 10);
        
        Hook::addAction('multi.hook', function () use (&$callOrder) {
            $callOrder[] = 'second';
        }, 20);
        
        Hook::doAction('multi.hook');
        
        expect($callOrder)->toEqual(['first', 'second']);
    });
});
