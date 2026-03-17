# SaliksikHub Plugin System Architecture

## Overview

This document outlines the plugin system architecture for SaliksikHub, transforming it into a modular, OJS-like platform for academic journal management.

## Goals

- **Modularity**: Extend functionality without modifying core code
- **Flexibility**: Allow third-party developers to create plugins
- **Safety**: Plugins can be enabled/disabled without breaking the system
- **Multi-tenancy**: Plugins can be enabled per-journal or globally

## Architecture Components

### 1. Core Components

#### Plugin Manager (`app/Core/Plugin/PluginManager.php`)
- **Responsibility**: Manage plugin lifecycle (install, enable, disable, uninstall)
- **Methods**:
  - `install($source)` - Install from directory or zip
  - `uninstall($pluginId)` - Remove plugin
  - `enable($pluginId, $journalId = null)` - Enable plugin
  - `disable($pluginId, $journalId = null)` - Disable plugin
  - `getActive($journalId = null)` - Get active plugins
  - `loadActive()` - Bootstrap active plugins

#### Hook System (`app/Core/Plugin/Hook.php`)
- **Responsibility**: Event-driven architecture for plugin communication
- **Methods**:
  - `addAction($hook, $callback, $priority = 10)` - Register action listener
  - `doAction($hook, ...$args)` - Trigger action
  - `addFilter($hook, $callback, $priority = 10)` - Register filter
  - `applyFilters($hook, $value, ...$args)` - Apply filters

#### Plugin Interface (`app/Core/Plugin/Contracts/PluginInterface.php`)
- **Contract**: All plugins must implement this interface
- **Methods**:
  - `register()` - Register hooks and filters
  - `boot()` - Initialize plugin
  - `activate()` - Run on activation
  - `deactivate()` - Run on deactivation
  - `uninstall()` - Cleanup on removal
  - `getInfo()` - Return plugin metadata
  - `hasSettings()` - Has settings page?
  - `renderSettings()` - Render settings UI

### 2. Database Schema

#### plugins table
Stores plugin metadata and status.

```sql
CREATE TABLE plugins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,           -- Unique identifier (e.g., "announcement-banner")
    display_name VARCHAR(255) NOT NULL,          -- Human-readable name
    version VARCHAR(50) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    path VARCHAR(500) NOT NULL,                  -- Path to plugin directory
    is_global BOOLEAN DEFAULT FALSE,             -- Available to all journals
    enabled BOOLEAN DEFAULT FALSE,               -- Globally enabled
    settings JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### journal_plugins table
Stores per-journal plugin activation and settings.

```sql
CREATE TABLE journal_plugins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    journal_id BIGINT UNSIGNED NOT NULL,
    plugin_id BIGINT UNSIGNED NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    settings JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
    FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE,
    UNIQUE KEY unique_journal_plugin (journal_id, plugin_id)
);
```

### 3. Directory Structure

```
app/
├── Core/
│   └── Plugin/
│       ├── PluginManager.php
│       ├── Hook.php
│       ├── PluginLoader.php
│       └── Contracts/
│           └── PluginInterface.php
├── Plugins/                                    # Core plugins (built-in)
│   └── Core/
│       └── AnnouncementBanner/
│           ├── AnnouncementBannerPlugin.php
│           ├── plugin.json
│           └── resources/
│               └── views/
└── Http/
    └── Controllers/
        └── Admin/
            └── PluginController.php

storage/
└── plugins/                                    # User-uploaded plugins
    └── announcement-banner-1.0.0/
        ├── AnnouncementBannerPlugin.php
        ├── plugin.json
        └── resources/

resources/
└── js/
    └── pages/
        └── admin/
            └── plugins/
                └── index.tsx
```

### 4. Plugin Structure

Each plugin is a self-contained directory with:

```
PluginName/
├── plugin.json              # Plugin metadata
├── PluginNamePlugin.php     # Main plugin class
├── resources/               # Assets, views, etc.
│   ├── views/
│   ├── css/
│   └── js/
├── routes/                  # Plugin routes (optional)
│   └── web.php
├── config/                  # Plugin config (optional)
│   └── config.php
└── database/                # Plugin migrations (optional)
    └── migrations/
```

#### plugin.json
```json
{
    "name": "announcement-banner",
    "displayName": "Announcement Banner",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "Display announcement banners on journal pages",
    "requires": {
        "php": "^8.3",
        "saliksikhub": "^2.0"
    },
    "hasSettings": true,
    "hooks": [
        "journal.header.before",
        "journal.homepage.before"
    ]
}
```

### 5. Hook Reference

#### Available Actions
- `plugin.activate` - After plugin activation
- `plugin.deactivate` - After plugin deactivation
- `manuscript.submitted` - After manuscript submission
- `manuscript.status.changed` - After status change
- `review.completed` - After review completion
- `journal.header.before` - Before journal header render
- `journal.header.after` - After journal header render
- `journal.footer.before` - Before journal footer render
- `journal.homepage.before` - Before homepage content
- `journal.homepage.after` - After homepage content

#### Available Filters
- `manuscript.title` - Modify manuscript title
- `manuscript.abstract` - Modify manuscript abstract
- `email.subject` - Modify email subject
- `email.body` - Modify email body
- `navigation.items` - Modify navigation items
- `user.profile.fields` - Modify user profile fields

### 6. Plugin Development Guide

#### Creating a Plugin

1. **Create Plugin Directory**
```bash
mkdir storage/plugins/my-plugin
```

2. **Create plugin.json**
```json
{
    "name": "my-plugin",
    "displayName": "My Plugin",
    "version": "1.0.0",
    "author": "Developer Name",
    "description": "Plugin description",
    "hasSettings": false
}
```

3. **Create Plugin Class**
```php
<?php

namespace Plugins\MyPlugin;

use App\Core\Plugin\Contracts\PluginInterface;
use App\Core\Plugin\Hook;

class MyPlugin implements PluginInterface
{
    public function register(): void
    {
        // Register hooks
        Hook::addAction('journal.header.before', [$this, 'addBanner'], 10);
        Hook::addFilter('manuscript.title', [$this, 'modifyTitle'], 10);
    }

    public function boot(): void
    {
        // Initialize plugin
    }

    public function activate(): void
    {
        // Run on activation
    }

    public function deactivate(): void
    {
        // Run on deactivation
    }

    public function uninstall(): void
    {
        // Cleanup
    }

    public function getInfo(): array
    {
        return [
            'name' => 'my-plugin',
            'version' => '1.0.0',
            'author' => 'Developer Name',
        ];
    }

    public function hasSettings(): bool
    {
        return false;
    }

    public function renderSettings(): mixed
    {
        return null;
    }

    public function addBanner(): void
    {
        echo '<div class="announcement">Hello from plugin!</div>';
    }

    public function modifyTitle(string $title): string
    {
        return '[Modified] ' . $title;
    }
}
```

4. **Install Plugin**
- Upload via Admin UI, or
- Place in `storage/plugins/` and run installation

#### Using Hooks in Core Code

**Actions:**
```php
use App\Core\Plugin\Hook;

// Fire an action
Hook::doAction('manuscript.submitted', $manuscript);
```

**Filters:**
```php
use App\Core\Plugin\Hook;

// Apply filters
$title = Hook::applyFilters('manuscript.title', $manuscript->title, $manuscript);
```

### 7. Admin Interface

#### Plugin Management Page
- List all installed plugins
- Enable/disable per journal
- Configure plugin settings
- Upload new plugins (.zip)
- Check for updates

#### Routes
```php
// routes/web.php (admin routes)
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/plugins', [PluginController::class, 'index'])->name('admin.plugins.index');
    Route::post('/plugins/install', [PluginController::class, 'install'])->name('admin.plugins.install');
    Route::post('/plugins/{plugin}/enable', [PluginController::class, 'enable'])->name('admin.plugins.enable');
    Route::post('/plugins/{plugin}/disable', [PluginController::class, 'disable'])->name('admin.plugins.disable');
    Route::delete('/plugins/{plugin}', [PluginController::class, 'destroy'])->name('admin.plugins.destroy');
    Route::get('/plugins/{plugin}/settings', [PluginController::class, 'settings'])->name('admin.plugins.settings');
    Route::post('/plugins/{plugin}/settings', [PluginController::class, 'updateSettings'])->name('admin.plugins.settings.update');
});
```

### 8. Security Considerations

1. **Plugin Isolation**
   - Plugins run in isolated namespaces
   - No direct database access (use models)
   - Sandboxed file system access

2. **Validation**
   - Validate plugin.json schema
   - Check PHP version compatibility
   - Verify file permissions

3. **Permissions**
   - Only super_admin can install/uninstall
   - Journal managers can enable/disable
   - Settings access controlled per plugin

### 9. Testing

#### Unit Tests
```php
// tests/Unit/Plugin/HookTest.php
it('can register and trigger actions', function () {
    $called = false;
    Hook::addAction('test.action', function () use (&$called) {
        $called = true;
    });
    
    Hook::doAction('test.action');
    
    expect($called)->toBeTrue();
});
```

#### Feature Tests
```php
// tests/Feature/Plugin/PluginInstallationTest.php
it('can install a plugin from directory', function () {
    $manager = app(PluginManager::class);
    
    $plugin = $manager->install(storage_path('plugins/test-plugin'));
    
    expect($plugin)->not->toBeNull();
    expect($plugin->name)->toBe('test-plugin');
});
```

### 10. Migration Strategy

#### From Current System
1. Install plugin system (new migrations)
2. Convert existing features to plugins:
   - Email templates → EmailTemplatesPlugin
   - Statistics → StatisticsPlugin
   - Review forms → ReviewFormsPlugin
3. Gradual migration over releases

#### Versioning
- Follow semantic versioning
- Plugins declare compatible SaliksikHub version
- Migration system for plugin database updates

## Implementation Timeline

### Phase 1: Core Plugin System (Weeks 1-2)
- [ ] Database migrations
- [ ] PluginManager service
- [ ] Hook system
- [ ] PluginInterface contract
- [ ] PluginLoader

### Phase 2: Admin Interface (Weeks 3-4)
- [ ] PluginController
- [ ] Plugin management UI
- [ ] Upload/install functionality
- [ ] Settings pages

### Phase 3: Sample Plugins (Week 5)
- [ ] AnnouncementBanner plugin
- [ ] Documentation
- [ ] Testing

### Phase 4: Integration (Week 6)
- [ ] Add hooks to core code
- [ ] Test with real use cases
- [ ] Performance optimization

## Next Steps

1. Run migrations to create plugin tables
2. Implement PluginManager
3. Create Hook system
4. Build sample plugin
5. Add hooks to existing code
6. Create admin UI

## Questions?

For questions or contributions, please refer to the main project documentation or create an issue in the repository.

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-17  
**Compatible With**: SaliksikHub v2.0+
