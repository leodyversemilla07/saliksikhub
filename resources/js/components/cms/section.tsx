import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Textarea } from '@/components/ui/textarea';

interface SectionContent {
    title?: string;
    subtitle?: string;
    body?: string;
    html?: string;
    background_image?: string;
    button_text?: string;
    button_url?: string;
    description?: string;
    image_url?: string;
    image_position?: string;
    email?: string;
    success_message?: string;
    cards?: Array<{
        title: string;
        description: string;
        icon?: string;
        link?: string;
    }>;
    stats?: Array<{ value: string; label: string }>;
    items?: Array<{ title: string; content: string }>;
}

interface SectionSettings {
    bg_color?: string;
    text_color?: string;
    padding?: string;
    full_width?: boolean;
}

interface Section {
    id: number;
    type: string;
    name: string;
    content: SectionContent;
    settings: SectionSettings;
}

interface Props {
    section: Section;
}

export default function CmsSection({ section }: Props) {
    const { type, content, settings } = section;

    const getPaddingClass = () => {
        switch (settings.padding) {
            case 'none':
                return 'py-0';
            case 'small':
                return 'py-8';
            case 'large':
                return 'py-24 sm:py-32';
            default:
                return 'py-16 sm:py-20';
        }
    };

    const style = {
        backgroundColor: (settings.bg_color as string) || undefined,
        color: (settings.text_color as string) || undefined,
    };

    const wrapperClass = `${getPaddingClass()} ${settings.full_width ? '' : ''}`;
    const containerClass = settings.full_width
        ? 'w-full'
        : 'mx-auto max-w-7xl px-6 lg:px-8';

    switch (type) {
        case 'hero':
            return <HeroSection content={content} settings={settings} />;
        case 'text':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <TextSection content={content} />
                    </div>
                </section>
            );
        case 'cards':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <CardsSection content={content} />
                    </div>
                </section>
            );
        case 'statistics':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <StatisticsSection content={content} />
                    </div>
                </section>
            );
        case 'cta':
            return <CtaSection content={content} settings={settings} />;
        case 'image_text':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <ImageTextSection content={content} />
                    </div>
                </section>
            );
        case 'accordion':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <AccordionSection content={content} />
                    </div>
                </section>
            );
        case 'contact_form':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <ContactFormSection content={content} />
                    </div>
                </section>
            );
        case 'custom_html':
            return (
                <section className={wrapperClass} style={style}>
                    <div className={containerClass}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: (content.html as string) || '',
                            }}
                        />
                    </div>
                </section>
            );
        default:
            return null;
    }
}

function HeroSection({
    content,
    settings,
}: {
    content: SectionContent;
    settings: SectionSettings;
}) {
    const backgroundImage = content.background_image;

    return (
        <section className="relative isolate overflow-hidden">
            {backgroundImage && (
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}
            {!backgroundImage && (
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-linear-to-br from-background via-muted/50 to-background" />
                </div>
            )}

            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                    <h1
                        className={`text-4xl font-bold tracking-tight sm:text-6xl ${backgroundImage ? 'text-white' : 'text-foreground'}`}
                    >
                        {content.title}
                    </h1>

                    {content.subtitle && (
                        <p
                            className={`mt-6 text-lg leading-8 ${backgroundImage ? 'text-gray-300' : 'text-muted-foreground'}`}
                        >
                            {content.subtitle}
                        </p>
                    )}

                    {content.button_text && content.button_url && (
                        <div className="mt-10">
                            <Link
                                href={content.button_url}
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                            >
                                {content.button_text}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function TextSection({ content }: { content: SectionContent }) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            {content.title && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                </h2>
            )}
            {content.body && (
                <div
                    className="mt-6"
                    dangerouslySetInnerHTML={{ __html: content.body }}
                />
            )}
        </div>
    );
}

function CardsSection({ content }: { content: SectionContent }) {
    const cards = content.cards || [];

    return (
        <div>
            {content.title && (
                <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                </h2>
            )}
            <div
                className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${content.title ? 'mt-10' : ''}`}
            >
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base">
                                {card.description}
                            </CardDescription>
                            {card.link && (
                                <Link
                                    href={card.link}
                                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                                >
                                    Learn more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function StatisticsSection({ content }: { content: SectionContent }) {
    const stats = content.stats || [];

    return (
        <div>
            {content.title && (
                <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                </h2>
            )}
            <div
                className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ${content.title ? 'mt-10' : ''}`}
            >
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className="text-4xl font-bold text-primary sm:text-5xl">
                            {stat.value}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CtaSection({
    content,
    settings,
}: {
    content: SectionContent;
    settings: SectionSettings;
}) {
    return (
        <section
            className="py-16 sm:py-24"
            style={{
                backgroundColor: settings.bg_color || 'var(--primary)',
            }}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {content.title}
                    </h2>
                    {content.description && (
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
                            {content.description}
                        </p>
                    )}
                    {content.button_text && content.button_url && (
                        <div className="mt-10">
                            <Link
                                href={content.button_url}
                                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                            >
                                {content.button_text}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function ImageTextSection({ content }: { content: SectionContent }) {
    const imagePosition = content.image_position || 'left';

    return (
        <div
            className={`grid gap-12 lg:grid-cols-2 lg:items-center ${imagePosition === 'right' ? 'lg:grid-flow-col-dense' : ''}`}
        >
            <div className={imagePosition === 'right' ? 'lg:col-start-2' : ''}>
                {content.image_url && (
                    <img
                        src={content.image_url}
                        alt={content.title || ''}
                        className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg"
                    />
                )}
            </div>
            <div className={imagePosition === 'right' ? 'lg:col-start-1' : ''}>
                {content.title && (
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {content.title}
                    </h2>
                )}
                {content.body && (
                    <div
                        className="prose dark:prose-invert mt-6"
                        dangerouslySetInnerHTML={{ __html: content.body }}
                    />
                )}
            </div>
        </div>
    );
}

function AccordionSection({ content }: { content: SectionContent }) {
    const items = content.items || [];

    return (
        <div className="mx-auto max-w-3xl">
            {content.title && (
                <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                </h2>
            )}
            <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div
                                className="prose dark:prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: item.content,
                                }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

function ContactFormSection({ content }: { content: SectionContent }) {
    return (
        <div className="mx-auto max-w-2xl">
            {content.title && (
                <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                </h2>
            )}
            {content.description && (
                <p className="mt-4 text-center text-lg text-muted-foreground">
                    {content.description}
                </p>
            )}
            <form className="mt-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        rows={5}
                        required
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                    Send Message
                </Button>
            </form>
        </div>
    );
}
