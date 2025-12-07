# Multi-Tenancy Implementation Plan

## Overview

Transform Saliksikhub from a single-journal RJMS (Research Journal Management System) into a multi-tenant SaaS platform serving multiple Philippine State Universities and Colleges (SUCs), with centralized maintenance and updates.

### Why Multi-Tenancy?

| Problem (Self-Hosted per Institution) | Solution (Multi-Tenant Platform) |
|---------------------------------------|----------------------------------|
| Each SUC manages their own server | You manage one platform |
| No IT staff for updates/security | You push updates to everyone |
| Bugs stay unfixed for months | One fix benefits all tenants |
| Different versions = chaos | Everyone on same version |
| Each pays for hosting separately | Shared infrastructure = cheaper |
| Data backups? What backups? | Centralized backup strategy |

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                 Saliksikhub Platform (Central)               │
│         ┌─────────────────────────────────────────┐          │
│         │  Bug fixes, security updates, backups   │          │
│         │  24/7 monitoring, performance tuning    │          │
│         └─────────────────────────────────────────┘          │
├──────────────────────────────────────────────────────────────┤
│  Institution A          Institution B          Institution C │
│  (MinSU)                (PSU)                  (ISU)         │
│  ┌────────────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │ Research J.    │    │ Multidisc J. │    │ Education J.  │ │
│  │ Science J.     │    └──────────────┘    │ AgriSci J.    │ │
│  │ Social Sci J.  │                        └───────────────┘ │
│  └────────────────┘                                          │
├──────────────────────────────────────────────────────────────┤
│              Single Database (Tenant-Scoped)                 │
│     institutions → journals → manuscripts → reviews          │
└──────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### Database Tables (Existing)

| Table | Key Columns | Tenant Scoping Needed |
|-------|-------------|----------------------|
| `users` | id, email, role, affiliation | Add `institution_id` |
| `manuscripts` | id, user_id, title, status | Add `journal_id` |
| `manuscript_authors` | manuscript_id, user_id | Via manuscript |
| `manuscript_files` | manuscript_id, file_type | Via manuscript |
| `manuscript_revisions` | manuscript_id, version | Via manuscript |
| `reviews` | manuscript_id, reviewer_id | Via manuscript |
| `editorial_decisions` | manuscript_id, editor_id | Via manuscript |
| `issues` | id, volume_number, status | Add `journal_id` |
| `issue_comments` | issue_id, user_id | Via issue |

### Current Role Structure (Spatie Permission)

```php
$roles = [
    'managing_editor',      // Admin/Dashboard access
    'editor_in_chief',      // Editorial oversight
    'associate_editor',     // Handle specific manuscripts
    'language_editor',      // Copyediting
    'author',               // Submit manuscripts
    'reviewer',             // Review manuscripts
];
```

### Hardcoded References to Remove

| File | Hardcoded Content |
|------|-------------------|
| `resources/js/components/site-header.tsx` | "Mindoro State University", ISSN, logo URL |
| `resources/js/pages/about-journal.tsx` | Entire "Daluyang Dunong" journal details |
| `resources/js/pages/submissions.tsx` | "SaliksikHub" branding |

---

## Implementation Steps

### Step 1: Create Institution and Journal Models with Migrations

**New Tables:**

```sql
-- institutions table
CREATE TABLE institutions (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,           -- "Mindoro State University"
    slug VARCHAR(255) UNIQUE NOT NULL,    -- "minsu"
    domain VARCHAR(255) UNIQUE NULL,      -- "minsu.saliksikhub.com" or custom
    logo_path VARCHAR(255) NULL,
    address TEXT NULL,
    contact_email VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    settings JSON NULL,                   -- Customization options
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- journals table
CREATE TABLE journals (
    id BIGINT PRIMARY KEY,
    institution_id BIGINT NOT NULL REFERENCES institutions(id),
    name VARCHAR(255) NOT NULL,           -- "Daluyang Dunong Multidisciplinary Research Journal"
    slug VARCHAR(255) NOT NULL,           -- "ddmrj"
    abbreviation VARCHAR(50) NULL,        -- "DDMRJ"
    description TEXT NULL,
    issn VARCHAR(20) NULL,                -- Print ISSN
    eissn VARCHAR(20) NULL,               -- Electronic ISSN
    logo_path VARCHAR(255) NULL,
    cover_image_path VARCHAR(255) NULL,
    submission_guidelines TEXT NULL,
    review_policy TEXT NULL,
    publication_frequency VARCHAR(100) NULL, -- "Quarterly", "Bi-annual"
    settings JSON NULL,                   -- Journal-specific settings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    UNIQUE(institution_id, slug)
);

-- journal_user pivot table (for journal-specific role assignments)
CREATE TABLE journal_user (
    id BIGINT PRIMARY KEY,
    journal_id BIGINT NOT NULL REFERENCES journals(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(100) NOT NULL,           -- 'editor_in_chief', 'associate_editor', etc.
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    UNIQUE(journal_id, user_id, role)
);
```

**Files to Create:**
- `database/migrations/xxxx_create_institutions_table.php`
- `database/migrations/xxxx_create_journals_table.php`
- `database/migrations/xxxx_create_journal_user_table.php`
- `app/Models/Institution.php`
- `app/Models/Journal.php`

---

### Step 2: Add `journal_id` to Tenant-Scoped Tables

**Migration to modify existing tables:**

```sql
-- Add to manuscripts table
ALTER TABLE manuscripts ADD COLUMN journal_id BIGINT REFERENCES journals(id);

-- Add to issues table  
ALTER TABLE issues ADD COLUMN journal_id BIGINT REFERENCES journals(id);

-- Add to users table (institution association)
ALTER TABLE users ADD COLUMN institution_id BIGINT REFERENCES institutions(id);
```

**Create BelongsToJournal Trait:**

```php
// app/Models/Concerns/BelongsToJournal.php
namespace App\Models\Concerns;

use App\Models\Journal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToJournal
{
    protected static function bootBelongsToJournal(): void
    {
        // Auto-scope queries to current journal
        static::addGlobalScope('journal', function (Builder $query) {
            if ($journal = app('currentJournal')) {
                $query->where($query->getModel()->getTable() . '.journal_id', $journal->id);
            }
        });

        // Auto-set journal_id on create
        static::creating(function ($model) {
            if ($journal = app('currentJournal')) {
                $model->journal_id ??= $journal->id;
            }
        });
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    public function scopeForJournal(Builder $query, Journal $journal): Builder
    {
        return $query->withoutGlobalScope('journal')->where('journal_id', $journal->id);
    }
}
```

**Files to Create:**
- `database/migrations/xxxx_add_journal_id_to_manuscripts_table.php`
- `database/migrations/xxxx_add_journal_id_to_issues_table.php`
- `database/migrations/xxxx_add_institution_id_to_users_table.php`
- `app/Models/Concerns/BelongsToJournal.php`

---

### Step 3: Enable Spatie Permission Teams

**Update config/permission.php:**

```php
// Change from false to true
'teams' => true,

// Use journal_id as team identifier
'team_foreign_key' => 'journal_id',
```

**Update RoleAndPermissionSeeder:**

```php
// Roles become journal-scoped
$journal = Journal::first();

// Assign role with journal context
$user->assignRole('editor_in_chief', $journal);

// Check permission with journal context
$user->hasRole('editor_in_chief', $journal);
```

**Files to Modify:**
- `config/permission.php`
- `database/seeders/RoleAndPermissionSeeder.php`

---

### Step 4: Create Tenant Resolution Middleware

**SetCurrentJournal Middleware:**

```php
// app/Http/Middleware/SetCurrentJournal.php
namespace App\Http\Middleware;

use App\Models\Institution;
use App\Models\Journal;
use Closure;
use Illuminate\Http\Request;

class SetCurrentJournal
{
    public function handle(Request $request, Closure $next)
    {
        $journal = $this->resolveJournal($request);
        
        if (!$journal) {
            abort(404, 'Journal not found');
        }
        
        // Bind to container for global access
        app()->instance('currentJournal', $journal);
        app()->instance('currentInstitution', $journal->institution);
        
        // Set Spatie Permission team context
        setPermissionsTeamId($journal->id);
        
        return $next($request);
    }
    
    protected function resolveJournal(Request $request): ?Journal
    {
        // Strategy 1: Subdomain (journal.saliksikhub.com)
        $host = $request->getHost();
        $journal = Journal::where('domain', $host)
            ->orWhereHas('institution', fn($q) => $q->where('domain', $host))
            ->first();
        
        if ($journal) {
            return $journal;
        }
        
        // Strategy 2: Path-based (/minsu/ddmrj/...)
        $institutionSlug = $request->route('institution');
        $journalSlug = $request->route('journal');
        
        if ($institutionSlug && $journalSlug) {
            return Journal::whereHas('institution', fn($q) => 
                $q->where('slug', $institutionSlug)
            )->where('slug', $journalSlug)->first();
        }
        
        // Strategy 3: Journal slug only (for simpler setup)
        if ($journalSlug = $request->route('journal')) {
            return Journal::where('slug', $journalSlug)->first();
        }
        
        return null;
    }
}
```

**Register in bootstrap/app.php:**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'journal' => \App\Http\Middleware\SetCurrentJournal::class,
    ]);
})
```

**Files to Create:**
- `app/Http/Middleware/SetCurrentJournal.php`

**Files to Modify:**
- `bootstrap/app.php`

---

### Step 5: Update Models with Tenancy Traits

**Manuscript Model:**

```php
use App\Models\Concerns\BelongsToJournal;

class Manuscript extends Model
{
    use BelongsToJournal;
    
    protected $fillable = [
        'journal_id', // Add this
        // ... existing fillable
    ];
}
```

**Issue Model:**

```php
use App\Models\Concerns\BelongsToJournal;

class Issue extends Model
{
    use BelongsToJournal;
    
    protected $fillable = [
        'journal_id', // Add this
        // ... existing fillable
    ];
}
```

**Files to Modify:**
- `app/Models/Manuscript.php`
- `app/Models/Issue.php`

---

### Step 6: Refactor Routes for Journal Context

**Option A: Subdomain Routing**

```php
// routes/web.php
Route::domain('{journal}.saliksikhub.com')
    ->middleware(['journal'])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        // ... all journal-scoped routes
    });
```

**Option B: Path-Based Routing**

```php
// routes/web.php
Route::prefix('{institution}/{journal}')
    ->middleware(['journal'])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        // ... all journal-scoped routes
    });
```

**Option C: Hybrid (Recommended)**

```php
// Central routes (platform admin, account management)
Route::prefix('platform')->group(function () {
    Route::get('/dashboard', [PlatformController::class, 'dashboard']);
    Route::resource('/institutions', InstitutionController::class);
});

// Journal-scoped routes
Route::prefix('j/{journal}')
    ->middleware(['journal'])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('journal.home');
        Route::get('/current', [CurrentIssueController::class, 'show']);
        // ... all public journal routes
        
        Route::middleware(['auth'])->group(function () {
            Route::prefix('author')->group(/* author routes */);
            Route::prefix('editor')->group(/* editor routes */);
            Route::prefix('reviewer')->group(/* reviewer routes */);
        });
    });
```

**Files to Modify:**
- `routes/web.php`
- `routes/auth.php`

---

### Step 7: Update Inertia Shared Data

**HandleInertiaRequests Middleware:**

```php
public function share(Request $request): array
{
    $journal = app('currentJournal');
    $institution = app('currentInstitution');
    
    return [
        ...parent::share($request),
        
        'currentJournal' => $journal ? [
            'id' => $journal->id,
            'name' => $journal->name,
            'slug' => $journal->slug,
            'abbreviation' => $journal->abbreviation,
            'description' => $journal->description,
            'issn' => $journal->issn,
            'eissn' => $journal->eissn,
            'logo' => $journal->logo_url,
            'submission_guidelines' => $journal->submission_guidelines,
        ] : null,
        
        'currentInstitution' => $institution ? [
            'id' => $institution->id,
            'name' => $institution->name,
            'slug' => $institution->slug,
            'logo' => $institution->logo_url,
            'website' => $institution->website,
        ] : null,
        
        'auth' => [
            'user' => $request->user() ? [
                // ... existing user data
                'journal_roles' => $journal 
                    ? $request->user()->roles->pluck('name') 
                    : [],
            ] : null,
        ],
    ];
}
```

**Files to Modify:**
- `app/Http/Middleware/HandleInertiaRequests.php`

---

### Step 8: Refactor Frontend for Dynamic Branding

**TypeScript Type Definitions:**

```typescript
// resources/js/types/index.d.ts
interface Journal {
    id: number;
    name: string;
    slug: string;
    abbreviation: string | null;
    description: string | null;
    issn: string | null;
    eissn: string | null;
    logo: string | null;
    submission_guidelines: string | null;
}

interface Institution {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
}

interface PageProps {
    currentJournal: Journal | null;
    currentInstitution: Institution | null;
    auth: {
        user: User | null;
    };
}
```

**Update site-header.tsx:**

```tsx
export function SiteHeader() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    
    return (
        <header>
            <img src={currentJournal?.logo || '/default-logo.png'} />
            <h1>{currentJournal?.name || 'Saliksikhub'}</h1>
            <p>{currentInstitution?.name}</p>
            {currentJournal?.issn && <span>ISSN: {currentJournal.issn}</span>}
        </header>
    );
}
```

**Files to Modify:**
- `resources/js/types/index.d.ts`
- `resources/js/components/site-header.tsx`
- `resources/js/components/site-footer.tsx`
- `resources/js/pages/about-journal.tsx`
- `resources/js/pages/submissions.tsx`
- `resources/js/pages/home.tsx`

---

### Step 9: Create Data Migration for Existing Records

**Migration Script:**

```php
// database/migrations/xxxx_migrate_existing_data_to_tenancy.php
public function up(): void
{
    // Create default institution
    $institution = Institution::create([
        'name' => 'Mindoro State University',
        'slug' => 'minsu',
        'domain' => 'minsu.saliksikhub.com',
        'is_active' => true,
    ]);
    
    // Create default journal
    $journal = Journal::create([
        'institution_id' => $institution->id,
        'name' => 'Daluyang Dunong Multidisciplinary Research Journal',
        'slug' => 'ddmrj',
        'abbreviation' => 'DDMRJ',
        'issn' => '2024-XXXX',
        'is_active' => true,
    ]);
    
    // Migrate existing manuscripts
    DB::table('manuscripts')->update(['journal_id' => $journal->id]);
    
    // Migrate existing issues
    DB::table('issues')->update(['journal_id' => $journal->id]);
    
    // Migrate existing users
    DB::table('users')->update(['institution_id' => $institution->id]);
    
    // Migrate existing role assignments to be journal-scoped
    DB::table('model_has_roles')->update(['team_id' => $journal->id]);
}
```

**Files to Create:**
- `database/migrations/xxxx_migrate_existing_data_to_tenancy.php`

---

### Step 10: Update Factories and Seeders

**InstitutionFactory:**

```php
// database/factories/InstitutionFactory.php
class InstitutionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' University',
            'slug' => fake()->unique()->slug(2),
            'domain' => fake()->unique()->domainName(),
            'contact_email' => fake()->companyEmail(),
            'is_active' => true,
        ];
    }
}
```

**JournalFactory:**

```php
// database/factories/JournalFactory.php
class JournalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'name' => fake()->words(4, true) . ' Journal',
            'slug' => fake()->unique()->slug(2),
            'abbreviation' => strtoupper(fake()->lexify('???')),
            'issn' => fake()->numerify('####-####'),
            'is_active' => true,
        ];
    }
}
```

**Update Existing Factories:**

```php
// ManuscriptFactory - add journal_id
'journal_id' => Journal::factory(),

// IssueFactory - add journal_id
'journal_id' => Journal::factory(),
```

**Files to Create:**
- `database/factories/InstitutionFactory.php`
- `database/factories/JournalFactory.php`

**Files to Modify:**
- `database/factories/ManuscriptFactory.php`
- `database/factories/IssueFactory.php`
- `database/factories/UserFactory.php`
- `database/seeders/DatabaseSeeder.php`

---

### Step 11: Write Feature Tests for Tenancy Isolation

**Test Cases:**

```php
// tests/Feature/TenancyIsolationTest.php

it('scopes manuscripts to current journal', function () {
    $journal1 = Journal::factory()->create();
    $journal2 = Journal::factory()->create();
    
    $manuscript1 = Manuscript::factory()->create(['journal_id' => $journal1->id]);
    $manuscript2 = Manuscript::factory()->create(['journal_id' => $journal2->id]);
    
    // Set current journal context
    app()->instance('currentJournal', $journal1);
    
    expect(Manuscript::count())->toBe(1);
    expect(Manuscript::first()->id)->toBe($manuscript1->id);
});

it('prevents users from accessing other journals manuscripts', function () {
    $journal1 = Journal::factory()->create();
    $journal2 = Journal::factory()->create();
    
    $user = User::factory()->create(['institution_id' => $journal1->institution_id]);
    $user->assignRole('author', $journal1);
    
    $manuscript = Manuscript::factory()->create(['journal_id' => $journal2->id]);
    
    actingAs($user)
        ->get(route('journal.manuscripts.show', [
            'journal' => $journal2->slug,
            'manuscript' => $manuscript->slug
        ]))
        ->assertForbidden();
});

it('allows cross-journal reviewers to access assigned journals', function () {
    $journal1 = Journal::factory()->create();
    $journal2 = Journal::factory()->create();
    
    $reviewer = User::factory()->create();
    $reviewer->assignRole('reviewer', $journal1);
    $reviewer->assignRole('reviewer', $journal2);
    
    expect($reviewer->hasRole('reviewer', $journal1))->toBeTrue();
    expect($reviewer->hasRole('reviewer', $journal2))->toBeTrue();
});

it('auto-assigns journal_id when creating manuscripts', function () {
    $journal = Journal::factory()->create();
    app()->instance('currentJournal', $journal);
    
    $manuscript = Manuscript::factory()->create(['journal_id' => null]);
    
    expect($manuscript->journal_id)->toBe($journal->id);
});
```

**Files to Create:**
- `tests/Feature/TenancyIsolationTest.php`
- `tests/Feature/JournalAccessTest.php`
- `tests/Feature/CrossJournalUserTest.php`

---

## Further Considerations

### 1. URL Strategy

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **Subdomain** | `ddmrj.saliksikhub.com` | Clean URLs, white-label ready, SEO friendly | Complex local development, DNS config needed |
| **Path-based** | `saliksikhub.com/j/ddmrj` | Simple local dev, no DNS needed | Longer URLs, harder to white-label |
| **Hybrid** | Both supported | Maximum flexibility | More code to maintain |

**Recommendation:** Start with **path-based** for simpler development, add subdomain support later.

---

### 2. User-Institution Relationship

| Approach | Schema | Pros | Cons |
|----------|--------|------|------|
| **Single institution** | `users.institution_id` | Simple, clear ownership | Reviewers can't serve multiple SUCs |
| **Multi-institution** | `institution_user` pivot | Flexible, reviewers can serve multiple | More complex queries |

**Recommendation:** Use **multi-institution pivot table** since academic reviewers often serve multiple institutions.

```sql
CREATE TABLE institution_user (
    id BIGINT PRIMARY KEY,
    institution_id BIGINT REFERENCES institutions(id),
    user_id BIGINT REFERENCES users(id),
    is_primary BOOLEAN DEFAULT FALSE,  -- User's home institution
    created_at TIMESTAMP,
    
    UNIQUE(institution_id, user_id)
);
```

---

### 3. Spatie Multitenancy Package

| Approach | Pros | Cons |
|----------|------|------|
| **spatie/laravel-multitenancy** | Tenant-aware queues/jobs/cache, well-tested, official package | Another dependency, learning curve |
| **Custom implementation** | Full control, lighter weight, tailored to needs | More code to maintain, edge cases to handle |

**Recommendation:** Start with **custom implementation** (simpler for shared-database approach), consider package if you need:
- Tenant-specific queues
- Tenant-specific cache
- Automatic tenant switching in jobs

---

## Implementation Order

```
Phase 1: Foundation (Week 1)
├── Step 1: Institution & Journal models/migrations
├── Step 2: Add journal_id columns
├── Step 3: Enable Spatie Permission teams
└── Step 9: Migrate existing data

Phase 2: Backend (Week 2)
├── Step 4: Tenant resolution middleware
├── Step 5: Update models with traits
└── Step 6: Refactor routes

Phase 3: Frontend (Week 3)
├── Step 7: Update Inertia shared data
└── Step 8: Dynamic branding components

Phase 4: Quality (Week 4)
├── Step 10: Update factories/seeders
├── Step 11: Write tenancy tests
└── Final testing & bug fixes
```

---

## File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `database/migrations/xxxx_create_institutions_table.php` | Institution table |
| `database/migrations/xxxx_create_journals_table.php` | Journal table |
| `database/migrations/xxxx_create_journal_user_table.php` | Journal-user pivot |
| `database/migrations/xxxx_add_journal_id_to_manuscripts_table.php` | Tenant scope manuscripts |
| `database/migrations/xxxx_add_journal_id_to_issues_table.php` | Tenant scope issues |
| `database/migrations/xxxx_add_institution_id_to_users_table.php` | User institution |
| `database/migrations/xxxx_migrate_existing_data_to_tenancy.php` | Data migration |
| `app/Models/Institution.php` | Institution model |
| `app/Models/Journal.php` | Journal model |
| `app/Models/Concerns/BelongsToJournal.php` | Tenant scoping trait |
| `app/Http/Middleware/SetCurrentJournal.php` | Tenant resolution |
| `database/factories/InstitutionFactory.php` | Testing factory |
| `database/factories/JournalFactory.php` | Testing factory |
| `tests/Feature/TenancyIsolationTest.php` | Tenancy tests |

### Existing Files to Modify

| File | Changes |
|------|---------|
| `config/permission.php` | Enable teams |
| `bootstrap/app.php` | Register middleware |
| `app/Models/Manuscript.php` | Add BelongsToJournal trait |
| `app/Models/Issue.php` | Add BelongsToJournal trait |
| `app/Models/User.php` | Add institution relationship |
| `app/Http/Middleware/HandleInertiaRequests.php` | Share journal context |
| `routes/web.php` | Add journal prefix/groups |
| `resources/js/types/index.d.ts` | Add Journal/Institution types |
| `resources/js/components/site-header.tsx` | Dynamic branding |
| `resources/js/components/site-footer.tsx` | Dynamic branding |
| `resources/js/pages/about-journal.tsx` | Dynamic content |
| `resources/js/pages/submissions.tsx` | Dynamic content |
| `database/factories/ManuscriptFactory.php` | Add journal_id |
| `database/factories/IssueFactory.php` | Add journal_id |
| `database/seeders/RoleAndPermissionSeeder.php` | Team-scoped roles |
