import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

interface SectionContent {
    [key: string]: unknown;
}

interface SectionSettings {
    bg_color?: string;
    text_color?: string;
    padding?: string;
    full_width?: boolean;
    [key: string]: unknown;
}

interface Section {
    id: number;
    type: string;
    name: string;
    content: SectionContent;
    settings: SectionSettings;
    is_visible: boolean;
}

interface Page {
    id: number;
    title: string;
}

interface Journal {
    id: number;
    name: string;
}

interface Props {
    journal: Journal;
    page: Page;
    section: Section;
    sectionTypes: Record<string, string>;
}

export default function SectionEdit({
    journal,
    page,
    section,
    sectionTypes,
}: Props) {
    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        {
            label: journal.name,
            href: admin.journals.edit.url({ journal: journal.id }),
        },
        {
            label: 'CMS - Pages',
            href: `/admin/journals/${journal.id}/cms/pages`,
        },
        {
            label: page.title,
            href: `/admin/journals/${journal.id}/cms/pages/${page.id}/edit`,
        },
        {
            label: `Edit Section: ${section.name || sectionTypes[section.type]}`,
        },
    ];

    const { data, setData, put, processing, isDirty } = useForm<any>({
        name: section.name,
        content: section.content,
        settings: section.settings,
        is_visible: section.is_visible,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            `/admin/journals/${journal.id}/cms/pages/${page.id}/sections/${section.id}`,
        );
    };

    const updateContent = (key: string, value: unknown) => {
        setData('content', { ...data.content, [key]: value });
    };

    const updateSettings = (key: string, value: unknown) => {
        setData('settings', {
            ...data.settings,
            [key]: value,
        } as SectionSettings);
    };

    const renderContentEditor = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <HeroEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'text':
                return (
                    <TextEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'cards':
                return (
                    <CardsEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'statistics':
                return (
                    <StatisticsEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'cta':
                return (
                    <CtaEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'image_text':
                return (
                    <ImageTextEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'accordion':
                return (
                    <AccordionEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'contact_form':
                return (
                    <ContactFormEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            case 'custom_html':
                return (
                    <CustomHtmlEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
            default:
                return (
                    <GenericEditor
                        content={data.content}
                        updateContent={updateContent}
                    />
                );
        }
    };

    const renderSettingsEditor = () => {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bg_color">Background Color</Label>
                    <div className="flex gap-2">
                        <div
                            className="h-10 w-10 cursor-pointer rounded-md border"
                            style={{
                                backgroundColor:
                                    (data.settings.bg_color as string) ||
                                    '#ffffff',
                            }}
                        >
                            <input
                                type="color"
                                id="bg_color"
                                value={
                                    (data.settings.bg_color as string) ||
                                    '#ffffff'
                                }
                                onChange={(e) =>
                                    updateSettings('bg_color', e.target.value)
                                }
                                className="h-full w-full cursor-pointer opacity-0"
                            />
                        </div>
                        <Input
                            value={
                                (data.settings.bg_color as string) || '#ffffff'
                            }
                            onChange={(e) =>
                                updateSettings('bg_color', e.target.value)
                            }
                            className="flex-1 font-mono uppercase"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="text_color">Text Color</Label>
                    <div className="flex gap-2">
                        <div
                            className="h-10 w-10 cursor-pointer rounded-md border"
                            style={{
                                backgroundColor:
                                    (data.settings.text_color as string) ||
                                    '#000000',
                            }}
                        >
                            <input
                                type="color"
                                id="text_color"
                                value={
                                    (data.settings.text_color as string) ||
                                    '#000000'
                                }
                                onChange={(e) =>
                                    updateSettings('text_color', e.target.value)
                                }
                                className="h-full w-full cursor-pointer opacity-0"
                            />
                        </div>
                        <Input
                            value={
                                (data.settings.text_color as string) ||
                                '#000000'
                            }
                            onChange={(e) =>
                                updateSettings('text_color', e.target.value)
                            }
                            className="flex-1 font-mono uppercase"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="padding">Padding</Label>
                    <Select
                        value={(data.settings.padding as string) || 'medium'}
                        onValueChange={(value) =>
                            updateSettings('padding', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Full Width</Label>
                        <p className="text-sm text-muted-foreground">
                            Extend section to full page width
                        </p>
                    </div>
                    <Switch
                        checked={(data.settings.full_width as boolean) || false}
                        onCheckedChange={(checked) =>
                            updateSettings('full_width', checked)
                        }
                    />
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Edit Section - ${page.title}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            render={
                                <Link
                                    href={`/admin/journals/${journal.id}/cms/pages/${page.id}/edit`}
                                />
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Edit{' '}
                                {sectionTypes[section.type] || section.type}{' '}
                                Section
                            </h1>
                            <p className="text-muted-foreground">
                                {page.title} - {journal.name}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Section Name</CardTitle>
                                    <CardDescription>
                                        A friendly name to identify this section
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder={
                                            sectionTypes[section.type] ||
                                            section.type
                                        }
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Content</CardTitle>
                                    <CardDescription>
                                        Configure the content for this section
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderContentEditor()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visibility</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Visible</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Show this section on the page
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_visible}
                                            onCheckedChange={(checked) =>
                                                setData('is_visible', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Style Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderSettingsEditor()}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !isDirty}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

// Section Type Editors

function HeroEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Hero Title"
                />
            </div>
            <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                    value={(content.subtitle as string) || ''}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    placeholder="A brief description..."
                    rows={3}
                />
            </div>
            <div className="space-y-2">
                <Label>Background Image URL</Label>
                <Input
                    value={(content.background_image as string) || ''}
                    onChange={(e) =>
                        updateContent('background_image', e.target.value)
                    }
                    placeholder="https://..."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                        value={(content.button_text as string) || ''}
                        onChange={(e) =>
                            updateContent('button_text', e.target.value)
                        }
                        placeholder="Learn More"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button URL</Label>
                    <Input
                        value={(content.button_url as string) || ''}
                        onChange={(e) =>
                            updateContent('button_url', e.target.value)
                        }
                        placeholder="/about"
                    />
                </div>
            </div>
        </div>
    );
}

function TextEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title (optional)</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Section Title"
                />
            </div>
            <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                    value={(content.body as string) || ''}
                    onChange={(e) => updateContent('body', e.target.value)}
                    placeholder="Enter your content here... HTML is supported."
                    rows={10}
                />
                <p className="text-xs text-muted-foreground">
                    You can use HTML tags for formatting.
                </p>
            </div>
        </div>
    );
}

function CardsEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    const cards =
        (content.cards as Array<{
            title: string;
            description: string;
            icon?: string;
            link?: string;
        }>) || [];

    const addCard = () => {
        updateContent('cards', [
            ...cards,
            { title: '', description: '', icon: '', link: '' },
        ]);
    };

    const updateCard = (index: number, field: string, value: string) => {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [field]: value };
        updateContent('cards', newCards);
    };

    const removeCard = (index: number) => {
        updateContent(
            'cards',
            cards.filter((_, i) => i !== index),
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Section Title (optional)</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Our Features"
                />
            </div>

            <div className="space-y-4">
                <Label>Cards</Label>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="space-y-3 rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Card {index + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCard(index)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <Input
                            value={card.title}
                            onChange={(e) =>
                                updateCard(index, 'title', e.target.value)
                            }
                            placeholder="Card Title"
                        />
                        <Textarea
                            value={card.description}
                            onChange={(e) =>
                                updateCard(index, 'description', e.target.value)
                            }
                            placeholder="Card description..."
                            rows={2}
                        />
                        <Input
                            value={card.link || ''}
                            onChange={(e) =>
                                updateCard(index, 'link', e.target.value)
                            }
                            placeholder="Link URL (optional)"
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addCard}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                </Button>
            </div>
        </div>
    );
}

function StatisticsEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    const stats =
        (content.stats as Array<{ value: string; label: string }>) || [];

    const addStat = () => {
        updateContent('stats', [...stats, { value: '', label: '' }]);
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        updateContent('stats', newStats);
    };

    const removeStat = (index: number) => {
        updateContent(
            'stats',
            stats.filter((_, i) => i !== index),
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Section Title (optional)</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Our Impact"
                />
            </div>

            <div className="space-y-4">
                <Label>Statistics</Label>
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="grid flex-1 grid-cols-2 gap-3">
                            <Input
                                value={stat.value}
                                onChange={(e) =>
                                    updateStat(index, 'value', e.target.value)
                                }
                                placeholder="100+"
                            />
                            <Input
                                value={stat.label}
                                onChange={(e) =>
                                    updateStat(index, 'label', e.target.value)
                                }
                                placeholder="Published Articles"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStat(index)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addStat}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Statistic
                </Button>
            </div>
        </div>
    );
}

function CtaEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Ready to Submit?"
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={(content.description as string) || ''}
                    onChange={(e) =>
                        updateContent('description', e.target.value)
                    }
                    placeholder="Join our community of researchers..."
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                        value={(content.button_text as string) || ''}
                        onChange={(e) =>
                            updateContent('button_text', e.target.value)
                        }
                        placeholder="Submit Now"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button URL</Label>
                    <Input
                        value={(content.button_url as string) || ''}
                        onChange={(e) =>
                            updateContent('button_url', e.target.value)
                        }
                        placeholder="/submit"
                    />
                </div>
            </div>
        </div>
    );
}

function ImageTextEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="About Us"
                />
            </div>
            <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                    value={(content.body as string) || ''}
                    onChange={(e) => updateContent('body', e.target.value)}
                    placeholder="Enter your content..."
                    rows={6}
                />
            </div>
            <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                    value={(content.image_url as string) || ''}
                    onChange={(e) => updateContent('image_url', e.target.value)}
                    placeholder="https://..."
                />
            </div>
            <div className="space-y-2">
                <Label>Image Position</Label>
                <Select
                    value={(content.image_position as string) || 'left'}
                    onValueChange={(value) =>
                        updateContent('image_position', value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

function AccordionEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    const items =
        (content.items as Array<{ title: string; content: string }>) || [];

    const addItem = () => {
        updateContent('items', [...items, { title: '', content: '' }]);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateContent('items', newItems);
    };

    const removeItem = (index: number) => {
        updateContent(
            'items',
            items.filter((_, i) => i !== index),
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Section Title (optional)</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Frequently Asked Questions"
                />
            </div>

            <div className="space-y-4">
                <Label>Accordion Items</Label>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="space-y-3 rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Item {index + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <Input
                            value={item.title}
                            onChange={(e) =>
                                updateItem(index, 'title', e.target.value)
                            }
                            placeholder="Question or title"
                        />
                        <Textarea
                            value={item.content}
                            onChange={(e) =>
                                updateItem(index, 'content', e.target.value)
                            }
                            placeholder="Answer or content..."
                            rows={3}
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </div>
        </div>
    );
}

function ContactFormEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={(content.title as string) || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Contact Us"
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={(content.description as string) || ''}
                    onChange={(e) =>
                        updateContent('description', e.target.value)
                    }
                    placeholder="Get in touch with our team..."
                    rows={3}
                />
            </div>
            <div className="space-y-2">
                <Label>Email Address (for submissions)</Label>
                <Input
                    value={(content.email as string) || ''}
                    onChange={(e) => updateContent('email', e.target.value)}
                    placeholder="contact@journal.com"
                />
            </div>
            <div className="space-y-2">
                <Label>Success Message</Label>
                <Input
                    value={(content.success_message as string) || ''}
                    onChange={(e) =>
                        updateContent('success_message', e.target.value)
                    }
                    placeholder="Thank you for your message!"
                />
            </div>
        </div>
    );
}

function CustomHtmlEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Custom HTML</Label>
                <Textarea
                    value={(content.html as string) || ''}
                    onChange={(e) => updateContent('html', e.target.value)}
                    placeholder="<div>Your custom HTML here...</div>"
                    rows={15}
                    className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Enter raw HTML. Be careful with this feature as malformed
                    HTML can break the page layout.
                </p>
            </div>
        </div>
    );
}

function GenericEditor({
    content,
    updateContent,
}: {
    content: SectionContent;
    updateContent: (key: string, value: unknown) => void;
}) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                This section type uses dynamic content. Edit the JSON below:
            </p>
            <Textarea
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                    try {
                        const parsed = JSON.parse(e.target.value);
                        Object.keys(parsed).forEach((key) => {
                            updateContent(key, parsed[key]);
                        });
                    } catch {
                        // Invalid JSON, don't update
                    }
                }}
                rows={15}
                className="font-mono text-sm"
            />
        </div>
    );
}
