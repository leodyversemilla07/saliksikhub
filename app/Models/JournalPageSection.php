<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalPageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_page_id',
        'name',
        'type',
        'content',
        'settings',
        'order',
        'is_visible',
    ];

    protected $casts = [
        'content' => 'array',
        'settings' => 'array',
        'order' => 'integer',
        'is_visible' => 'boolean',
    ];

    /**
     * Available section types with their descriptions.
     */
    public const TYPES = [
        'hero' => [
            'name' => 'Hero Banner',
            'description' => 'Large hero section with title, subtitle, and call-to-action buttons',
            'icon' => 'Layout',
        ],
        'text' => [
            'name' => 'Text Content',
            'description' => 'Rich text content block',
            'icon' => 'FileText',
        ],
        'cards' => [
            'name' => 'Card Grid',
            'description' => 'Grid of cards for features, team members, or other content',
            'icon' => 'LayoutGrid',
        ],
        'statistics' => [
            'name' => 'Statistics',
            'description' => 'Display key metrics and statistics',
            'icon' => 'BarChart3',
        ],
        'cta' => [
            'name' => 'Call to Action',
            'description' => 'Prominent call-to-action section',
            'icon' => 'MousePointerClick',
        ],
        'image_text' => [
            'name' => 'Image with Text',
            'description' => 'Image alongside text content',
            'icon' => 'Image',
        ],
        'accordion' => [
            'name' => 'Accordion/FAQ',
            'description' => 'Collapsible accordion sections for FAQs',
            'icon' => 'ListCollapse',
        ],
        'contact_form' => [
            'name' => 'Contact Form',
            'description' => 'Contact form for user inquiries',
            'icon' => 'Mail',
        ],
        'editorial_board' => [
            'name' => 'Editorial Board',
            'description' => 'Display editorial board members',
            'icon' => 'Users',
        ],
        'recent_issues' => [
            'name' => 'Recent Issues',
            'description' => 'Display recent journal issues',
            'icon' => 'BookOpen',
        ],
        'recent_articles' => [
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'icon' => 'Newspaper',
        ],
        'announcements' => [
            'name' => 'Announcements',
            'description' => 'Display announcements and news',
            'icon' => 'Megaphone',
        ],
        'custom_html' => [
            'name' => 'Custom HTML',
            'description' => 'Custom HTML content block',
            'icon' => 'Code',
        ],
    ];

    /**
     * Default content structure for each section type.
     */
    public static function getDefaultContent(string $type): array
    {
        return match ($type) {
            'hero' => [
                'title' => 'Welcome to Our Journal',
                'subtitle' => 'Advancing knowledge through rigorous peer-reviewed research',
                'background_image' => null,
                'buttons' => [
                    ['label' => 'Submit Manuscript', 'url' => '/submissions', 'style' => 'primary'],
                    ['label' => 'Learn More', 'url' => '/about', 'style' => 'secondary'],
                ],
            ],
            'text' => [
                'heading' => '',
                'content' => '<p>Enter your content here...</p>',
            ],
            'cards' => [
                'heading' => 'Our Features',
                'cards' => [
                    ['title' => 'Feature 1', 'description' => 'Description here', 'icon' => 'Star'],
                    ['title' => 'Feature 2', 'description' => 'Description here', 'icon' => 'Award'],
                    ['title' => 'Feature 3', 'description' => 'Description here', 'icon' => 'Globe'],
                ],
            ],
            'statistics' => [
                'heading' => 'Our Impact',
                'stats' => [
                    ['label' => 'Published Articles', 'value' => '500+'],
                    ['label' => 'Active Reviewers', 'value' => '200+'],
                    ['label' => 'Countries', 'value' => '50+'],
                    ['label' => 'Years Active', 'value' => '10+'],
                ],
            ],
            'cta' => [
                'heading' => 'Ready to Submit Your Research?',
                'description' => 'Join our community of researchers and contribute to advancing knowledge.',
                'button_label' => 'Submit Now',
                'button_url' => '/submissions',
            ],
            'image_text' => [
                'heading' => 'About Us',
                'content' => '<p>Your content here...</p>',
                'image' => null,
                'image_position' => 'left', // left or right
            ],
            'accordion' => [
                'heading' => 'Frequently Asked Questions',
                'items' => [
                    ['question' => 'How do I submit a manuscript?', 'answer' => 'You can submit through our online portal...'],
                    ['question' => 'What is the review process?', 'answer' => 'Our peer review process involves...'],
                ],
            ],
            'contact_form' => [
                'heading' => 'Contact Us',
                'description' => 'Have questions? Get in touch with us.',
                'email' => 'journal@example.com',
                'show_address' => true,
                'show_phone' => true,
            ],
            'editorial_board' => [
                'heading' => 'Editorial Board',
                'description' => 'Meet our team of distinguished editors and reviewers.',
                'show_roles' => true,
            ],
            'recent_issues' => [
                'heading' => 'Recent Issues',
                'limit' => 4,
                'show_cover' => true,
            ],
            'recent_articles' => [
                'heading' => 'Recent Articles',
                'limit' => 6,
                'show_abstract' => true,
            ],
            'announcements' => [
                'heading' => 'Announcements',
                'limit' => 5,
            ],
            'custom_html' => [
                'html' => '<div>Your custom HTML here</div>',
            ],
            default => [],
        };
    }

    /**
     * Default settings for each section type.
     */
    public static function getDefaultSettings(string $type): array
    {
        return [
            'background_color' => null, // Uses theme default
            'text_color' => null,
            'padding_top' => 'md',     // sm, md, lg, xl
            'padding_bottom' => 'md',
            'container_width' => 'default', // default, wide, full
            'custom_css_class' => '',
        ];
    }

    /**
     * Get the page that owns this section.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(JournalPage::class, 'journal_page_id');
    }

    /**
     * Get merged content with defaults.
     */
    public function getMergedContentAttribute(): array
    {
        $defaults = self::getDefaultContent($this->type);

        return array_merge($defaults, $this->content ?? []);
    }

    /**
     * Get merged settings with defaults.
     */
    public function getMergedSettingsAttribute(): array
    {
        $defaults = self::getDefaultSettings($this->type);

        return array_merge($defaults, $this->settings ?? []);
    }
}
