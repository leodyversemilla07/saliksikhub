<?php

namespace Database\Seeders;

use App\Models\Manuscript;
use App\Models\Publication;
use App\Models\DOI;
use App\Models\Galley;
use App\Models\SubscriptionType;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OJSWorkflowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding OJS Workflow data...');

        // Create subscription types
        $this->seedSubscriptionTypes();

        // Create sample manuscripts with publications
        $this->seedManuscriptsWithPublications();

        // Create sample subscriptions
        $this->seedSubscriptions();

        // Create sample payments
        $this->seedPayments();

        $this->command->info('OJS Workflow data seeded successfully!');
    }

    /**
     * Seed subscription types
     */
    protected function seedSubscriptionTypes(): void
    {
        $this->command->info('Creating subscription types...');

        $types = [
            [
                'name' => 'Individual - Annual',
                'description' => 'Annual subscription for individual users',
                'price' => 99.00,
                'currency' => 'USD',
                'duration_months' => 12,
                'features' => [
                    'Full access to all published articles',
                    'Email alerts for new issues',
                    'Download rights',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Institutional - Annual',
                'description' => 'Annual subscription for institutions with IP range access',
                'price' => 499.00,
                'currency' => 'USD',
                'duration_months' => 12,
                'features' => [
                    'Unlimited users via IP authentication',
                    'Full access to all published articles',
                    'Usage statistics (COUNTER compliant)',
                    'SUSHI API access',
                    'Priority support',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Individual - Monthly',
                'description' => 'Monthly subscription for individual users',
                'price' => 9.99,
                'currency' => 'USD',
                'duration_months' => 1,
                'features' => [
                    'Full access to all published articles',
                    'Email alerts for new issues',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Student - Annual',
                'description' => 'Discounted annual subscription for students',
                'price' => 49.00,
                'currency' => 'USD',
                'duration_months' => 12,
                'features' => [
                    'Full access to all published articles',
                    'Email alerts for new issues',
                    'Requires student verification',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($types as $typeData) {
            SubscriptionType::firstOrCreate(
                ['name' => $typeData['name']],
                $typeData
            );
        }

        $this->command->info('Created ' . count($types) . ' subscription types.');
    }

    /**
     * Seed manuscripts with publications
     */
    protected function seedManuscriptsWithPublications(): void
    {
        $this->command->info('Creating sample manuscripts with publications...');

        // Get some existing manuscripts (assumes there are manuscripts in the system)
        $manuscripts = Manuscript::whereIn('status', ['accepted', 'published'])
            ->limit(5)
            ->get();

        if ($manuscripts->isEmpty()) {
            $this->command->warn('No accepted/published manuscripts found. Skipping publication seeding.');
            return;
        }

        foreach ($manuscripts as $manuscript) {
            // Skip if already has publications
            if ($manuscript->publications()->exists()) {
                continue;
            }

            // Create first publication (version 1.0)
            $publication = Publication::create([
                'manuscript_id' => $manuscript->id,
                'version_major' => 1,
                'version_minor' => 0,
                'version_stage' => 'published',
                'status' => 'published',
                'title' => $manuscript->title,
                'abstract' => $manuscript->abstract,
                'keywords' => $manuscript->keywords ?? ['sample', 'research', 'academic'],
                'date_published' => now()->subMonths(rand(1, 12)),
                'access_status' => $this->randomAccessStatus(),
                'url_path' => $manuscript->slug,
                'locale' => 'en',
            ]);

            // Update manuscript's current publication
            $manuscript->update(['current_publication_id' => $publication->id]);

            // Create DOI
            $this->createDOI($publication, $manuscript);

            // Create galleys
            $this->createGalleys($publication);

            $this->command->info("Created publication for manuscript #{$manuscript->id}");
        }
    }

    /**
     * Create DOI for publication
     */
    protected function createDOI(Publication $publication, Manuscript $manuscript): void
    {
        $prefix = config('services.crossref.doi_prefix', '10.00000');
        $suffix = strtolower(config('app.name', 'journal')) . '.v' . $publication->version_major . 'i' . $publication->version_minor . '.' . $manuscript->id;
        
        DOI::create([
            'doiable_type' => Publication::class,
            'doiable_id' => $publication->id,
            'doi' => $prefix . '/' . $suffix,
            'prefix' => $prefix,
            'suffix' => $suffix,
            'status' => 'deposited',
            'registration_agency' => 'crossref',
            'registered_at' => now()->subDays(rand(1, 30)),
        ]);
    }

    /**
     * Create galleys for publication
     */
    protected function createGalleys(Publication $publication): void
    {
        $galleyTypes = [
            ['label' => 'PDF', 'mime_type' => 'application/pdf', 'locale' => 'en'],
            ['label' => 'HTML', 'mime_type' => 'text/html', 'locale' => 'en'],
        ];

        foreach ($galleyTypes as $index => $galleyType) {
            Galley::create([
                'publication_id' => $publication->id,
                'label' => $galleyType['label'],
                'locale' => $galleyType['locale'],
                'file_path' => 'galleys/' . $publication->manuscript_id . '/' . $publication->id . '/' . Str::slug($galleyType['label']) . '-sample.pdf',
                'file_size' => rand(100000, 5000000), // 100KB to 5MB
                'mime_type' => $galleyType['mime_type'],
                'sequence' => $index + 1,
                'is_approved' => true,
                'download_count' => rand(0, 500),
                'last_downloaded_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }

    /**
     * Seed subscriptions
     */
    protected function seedSubscriptions(): void
    {
        $this->command->info('Creating sample subscriptions...');

        $types = SubscriptionType::where('is_active', true)->get();
        
        if ($types->isEmpty()) {
            $this->command->warn('No subscription types found. Skipping subscription seeding.');
            return;
        }

        // Get some users
        $users = User::limit(3)->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Skipping subscription seeding.');
            return;
        }

        foreach ($users as $index => $user) {
            $type = $types->random();
            
            // Determine subscription status
            $statuses = ['active', 'active', 'active', 'expired'];
            $status = $statuses[array_rand($statuses)];
            
            $startDate = now()->subMonths(rand(1, 6));
            $endDate = $status === 'active' 
                ? now()->addMonths(rand(1, 6))
                : now()->subDays(rand(1, 30));

            $subscription = Subscription::create([
                'subscription_type_id' => $type->id,
                'user_id' => $user->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
                'auto_renew' => rand(0, 1),
                'ip_ranges' => $type->name === 'Institutional - Annual' 
                    ? ['192.168.' . ($index + 1) . '.0/24']
                    : null,
            ]);

            $this->command->info("Created subscription for user #{$user->id}");
        }
    }

    /**
     * Seed payments
     */
    protected function seedPayments(): void
    {
        $this->command->info('Creating sample payments...');

        // Get some manuscripts for submission fees
        $manuscripts = Manuscript::limit(3)->get();
        
        if ($manuscripts->isEmpty()) {
            $this->command->warn('No manuscripts found. Skipping payment seeding.');
            return;
        }

        $gateways = ['stripe', 'paypal'];
        $statuses = ['completed', 'completed', 'completed', 'pending', 'failed'];

        foreach ($manuscripts as $manuscript) {
            // Create submission fee payment
            Payment::create([
                'user_id' => $manuscript->user_id,
                'payable_type' => Manuscript::class,
                'payable_id' => $manuscript->id,
                'amount' => 50.00,
                'currency' => 'USD',
                'type' => 'submission_fee',
                'status' => $statuses[array_rand($statuses)],
                'gateway' => $gateways[array_rand($gateways)],
                'transaction_id' => 'TXN-' . strtoupper(Str::random(12)) . '-' . time(),
                'gateway_transaction_id' => 'pi_' . strtoupper(Str::random(24)),
                'paid_at' => now()->subDays(rand(1, 60)),
            ]);

            $this->command->info("Created payment for manuscript #{$manuscript->id}");
        }

        // Create subscription payments
        $subscriptions = Subscription::where('status', 'active')->limit(2)->get();
        
        foreach ($subscriptions as $subscription) {
            Payment::create([
                'user_id' => $subscription->user_id,
                'payable_type' => Subscription::class,
                'payable_id' => $subscription->id,
                'amount' => $subscription->type->price,
                'currency' => $subscription->type->currency,
                'type' => 'subscription',
                'status' => 'completed',
                'gateway' => $gateways[array_rand($gateways)],
                'transaction_id' => 'TXN-' . strtoupper(Str::random(12)) . '-' . time(),
                'gateway_transaction_id' => 'pi_' . strtoupper(Str::random(24)),
                'paid_at' => $subscription->start_date,
            ]);
        }
    }

    /**
     * Get random access status
     */
    protected function randomAccessStatus(): string
    {
        $statuses = ['open', 'open', 'subscription', 'embargo'];
        return $statuses[array_rand($statuses)];
    }
}
