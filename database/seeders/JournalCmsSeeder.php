<?php

namespace Database\Seeders;

use App\Models\Journal;
use App\Models\JournalMenu;
use App\Models\JournalPage;
use App\Models\JournalPageSection;
use Illuminate\Database\Seeder;

class JournalCmsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $journals = Journal::all();

        foreach ($journals as $journal) {
            $this->seedJournalCms($journal);
        }
    }

    /**
     * Seed CMS content for a single journal.
     */
    public function seedJournalCms(Journal $journal): void
    {
        // Create Home Page
        $homePage = JournalPage::firstOrCreate(
            ['journal_id' => $journal->id, 'type' => 'home'],
            [
                'title' => 'Home',
                'slug' => 'home',
                'meta_description' => "Welcome to {$journal->name} - A peer-reviewed academic journal.",
                'is_published' => true,
                'show_in_menu' => false,
                'menu_order' => 0,
            ]
        );

        // Add sections to home page
        if ($homePage->sections()->count() === 0) {
            $homePage->sections()->createMany([
                [
                    'name' => 'Hero Section',
                    'type' => 'hero',
                    'content' => [
                        'title' => "Welcome to {$journal->name}",
                        'subtitle' => 'A peer-reviewed academic journal committed to advancing knowledge and fostering scholarly discourse.',
                        'button_text' => 'Submit Manuscript',
                        'button_url' => '/submissions',
                        'background_image' => null,
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('hero'),
                    'order' => 0,
                    'is_visible' => true,
                ],
                [
                    'name' => 'Statistics',
                    'type' => 'statistics',
                    'content' => [
                        'title' => 'Our Impact',
                        'stats' => [
                            ['value' => '100+', 'label' => 'Published Articles'],
                            ['value' => '50+', 'label' => 'Expert Reviewers'],
                            ['value' => '10+', 'label' => 'Issues Published'],
                            ['value' => '95%', 'label' => 'Author Satisfaction'],
                        ],
                    ],
                    'settings' => array_merge(JournalPageSection::getDefaultSettings('statistics'), [
                        'bg_color' => '#f8fafc',
                    ]),
                    'order' => 1,
                    'is_visible' => true,
                ],
                [
                    'name' => 'Call to Action',
                    'type' => 'cta',
                    'content' => [
                        'title' => 'Ready to Submit Your Research?',
                        'description' => 'Join our community of scholars and share your research with the world.',
                        'button_text' => 'Start Submission',
                        'button_url' => '/submissions',
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('cta'),
                    'order' => 2,
                    'is_visible' => true,
                ],
            ]);
        }

        // Create About Page
        $aboutPage = JournalPage::firstOrCreate(
            ['journal_id' => $journal->id, 'type' => 'about'],
            [
                'title' => 'About',
                'slug' => 'about',
                'meta_description' => "Learn more about {$journal->name}, our mission, and editorial policies.",
                'is_published' => true,
                'show_in_menu' => true,
                'menu_order' => 1,
            ]
        );

        if ($aboutPage->sections()->count() === 0) {
            $aboutPage->sections()->createMany([
                [
                    'name' => 'About Introduction',
                    'type' => 'text',
                    'content' => [
                        'title' => "About {$journal->name}",
                        'body' => "<p>{$journal->name} is dedicated to publishing high-quality, peer-reviewed research that advances knowledge in our field. Our journal maintains the highest standards of academic integrity and scholarly excellence.</p><p>We welcome submissions from researchers worldwide and are committed to a fair, rigorous, and timely review process.</p>",
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('text'),
                    'order' => 0,
                    'is_visible' => true,
                ],
            ]);
        }

        // Create Editorial Board Page
        $editorialPage = JournalPage::firstOrCreate(
            ['journal_id' => $journal->id, 'type' => 'editorial_board'],
            [
                'title' => 'Editorial Board',
                'slug' => 'editorial-board',
                'meta_description' => "Meet the editorial board of {$journal->name}.",
                'is_published' => true,
                'show_in_menu' => true,
                'menu_order' => 2,
            ]
        );

        // Create Submission Guidelines Page
        $submissionsPage = JournalPage::firstOrCreate(
            ['journal_id' => $journal->id, 'type' => 'submission_guidelines'],
            [
                'title' => 'Submission Guidelines',
                'slug' => 'submission-guidelines',
                'meta_description' => "Guidelines for submitting manuscripts to {$journal->name}.",
                'is_published' => true,
                'show_in_menu' => true,
                'menu_order' => 3,
            ]
        );

        if ($submissionsPage->sections()->count() === 0) {
            $submissionsPage->sections()->createMany([
                [
                    'name' => 'Submission Instructions',
                    'type' => 'text',
                    'content' => [
                        'title' => 'Submission Guidelines',
                        'body' => '<h3>Manuscript Preparation</h3><p>All manuscripts should be prepared according to our formatting guidelines. Please ensure your submission includes:</p><ul><li>Title page with author information</li><li>Abstract (250-300 words)</li><li>Keywords (5-7 keywords)</li><li>Main text with proper sections</li><li>References in the required format</li></ul><h3>Review Process</h3><p>All submissions undergo double-blind peer review. The review process typically takes 4-6 weeks.</p>',
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('text'),
                    'order' => 0,
                    'is_visible' => true,
                ],
                [
                    'name' => 'FAQ',
                    'type' => 'accordion',
                    'content' => [
                        'title' => 'Frequently Asked Questions',
                        'items' => [
                            [
                                'title' => 'What file formats are accepted?',
                                'content' => '<p>We accept manuscripts in Microsoft Word (.doc, .docx) and LaTeX formats.</p>',
                            ],
                            [
                                'title' => 'Is there a submission fee?',
                                'content' => '<p>There are no submission fees. Article processing charges may apply upon acceptance.</p>',
                            ],
                            [
                                'title' => 'How long does the review process take?',
                                'content' => '<p>The initial review typically takes 4-6 weeks. Revisions may extend the timeline.</p>',
                            ],
                        ],
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('accordion'),
                    'order' => 1,
                    'is_visible' => true,
                ],
            ]);
        }

        // Create Contact Page
        $contactPage = JournalPage::firstOrCreate(
            ['journal_id' => $journal->id, 'type' => 'contact'],
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'meta_description' => "Get in touch with the {$journal->name} editorial team.",
                'is_published' => true,
                'show_in_menu' => true,
                'menu_order' => 4,
            ]
        );

        if ($contactPage->sections()->count() === 0) {
            $contactPage->sections()->createMany([
                [
                    'name' => 'Contact Form',
                    'type' => 'contact_form',
                    'content' => [
                        'title' => 'Get in Touch',
                        'description' => 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
                        'email' => $journal->contact_email ?? 'contact@journal.com',
                        'success_message' => 'Thank you for your message! We\'ll get back to you soon.',
                    ],
                    'settings' => JournalPageSection::getDefaultSettings('contact_form'),
                    'order' => 0,
                    'is_visible' => true,
                ],
            ]);
        }

        // Create Menu Items
        $this->seedMenuItems($journal, [
            ['label' => 'Home', 'journal_page_id' => $homePage->id, 'order' => 0],
            ['label' => 'About', 'journal_page_id' => $aboutPage->id, 'order' => 1],
            ['label' => 'Editorial Board', 'journal_page_id' => $editorialPage->id, 'order' => 2],
            ['label' => 'Submissions', 'journal_page_id' => $submissionsPage->id, 'order' => 3],
            ['label' => 'Contact', 'journal_page_id' => $contactPage->id, 'order' => 4],
        ]);
    }

    /**
     * Seed menu items for a journal.
     */
    protected function seedMenuItems(Journal $journal, array $items): void
    {
        foreach ($items as $item) {
            JournalMenu::firstOrCreate(
                [
                    'journal_id' => $journal->id,
                    'journal_page_id' => $item['journal_page_id'],
                    'location' => 'header',
                ],
                [
                    'label' => $item['label'],
                    'url' => null,
                    'parent_id' => null,
                    'order' => $item['order'],
                    'is_active' => true,
                    'open_in_new_tab' => false,
                ]
            );
        }
    }
}
