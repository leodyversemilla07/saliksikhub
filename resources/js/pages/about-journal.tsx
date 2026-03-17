import { usePage } from '@inertiajs/react';
import {
    BookOpen,
    Target,
    Eye,
    Star,
    Unlock,
    Users,
    BookCopy,
    Globe,
    ShieldCheck,
    LifeBuoy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

export default function AboutJournal() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;

    const journalName = currentJournal?.name ?? 'Research Journal';
    const journalAbbreviation = currentJournal?.abbreviation ?? 'RJMS';
    const institutionName = currentInstitution?.name ?? 'Institution';
    const journalDescription =
        currentJournal?.description ??
        'A distinguished, open-access, peer-reviewed scholarly publication committed to advancing knowledge and fostering intellectual discourse across a wide spectrum of disciplines.';

    const badges = [
        ...(currentJournal?.settings?.open_access !== false
            ? ['Open Access']
            : []),
        ...(currentJournal?.settings?.peer_reviewed !== false
            ? ['Peer Reviewed']
            : []),
        ...(currentJournal?.settings?.disciplines ?? ['Multidisciplinary']),
        `${currentInstitution?.abbreviation ?? institutionName} Publication`,
    ];

    return (
        <PublicLayout title={`About the Journal | ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-oxford-blue mb-2 font-serif text-3xl font-bold md:text-4xl">
                        About the Journal
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Learn about {journalName} and our commitment to academic
                        excellence.
                    </p>
                </div>

                {/* Journal Overview Section */}
                <Card className="from-parchment/20 to-parchment/10 border-oxford-blue/20 mb-8 bg-linear-to-r">
                    <CardHeader>
                        <CardTitle className="text-oxford-blue flex items-center gap-3 font-serif text-2xl">
                            <BookOpen className="text-oxford-blue h-8 w-8" />
                            Journal Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">
                                    {journalName} ({journalAbbreviation})
                                </strong>{' '}
                                {journalDescription}
                            </p>
                            <p className="leading-relaxed text-muted-foreground">
                                Published by {institutionName},{' '}
                                {journalAbbreviation} serves as a vital platform
                                for researchers, academics, and practitioners to
                                disseminate original research, innovative ideas,
                                and insightful analyses. The journal upholds
                                rigorous academic standards through a meticulous
                                double-blind peer-review process, ensuring the
                                quality, validity, and significance of every
                                published article.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {badges.map((badge, index) => (
                                    <Badge key={index} variant="secondary">
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mission and Vision Section */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    {/* Mission */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Target className="h-6 w-6 text-primary" />
                                Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-muted-foreground">
                                To be a leading multidisciplinary journal that
                                champions academic excellence, ethical research,
                                and the widespread dissemination of knowledge,
                                contributing to societal development and global
                                understanding.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Vision */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Eye className="h-6 w-6 text-primary" />
                                Vision
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-muted-foreground">
                                To provide a dynamic and inclusive platform for
                                scholarly communication, fostering critical
                                inquiry, innovation, and collaboration across
                                diverse fields of study to address complex
                                challenges and inspire positive change.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Features Section */}
                <Card className="mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-oxford-blue flex items-center justify-center gap-3 font-serif text-2xl">
                            <Star className="text-amber h-8 w-8" />
                            Key Features
                        </CardTitle>
                        <CardDescription>
                            What makes {journalName} a distinguished research
                            publication
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: 'Open Access',
                                    description:
                                        'Ensuring free and unrestricted access to all published articles, promoting wider readership and knowledge sharing.',
                                    icon: (
                                        <Unlock className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                                {
                                    title: 'Peer Review',
                                    description:
                                        'Employing a rigorous double-blind peer-review process to maintain high academic standards and integrity.',
                                    icon: (
                                        <Users className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                                {
                                    title: 'Multidisciplinary Scope',
                                    description:
                                        'Welcoming contributions from a broad range of disciplines, encouraging cross-pollination of ideas.',
                                    icon: (
                                        <BookCopy className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                                {
                                    title: 'Global Reach',
                                    description:
                                        'Disseminating research to a worldwide audience, fostering international collaboration and impact.',
                                    icon: (
                                        <Globe className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                                {
                                    title: 'Ethical Standards',
                                    description:
                                        'Adhering to the highest ethical guidelines in publishing, ensuring transparency and accountability.',
                                    icon: (
                                        <ShieldCheck className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                                {
                                    title: 'Author Support',
                                    description:
                                        'Providing comprehensive support to authors throughout the submission and publication process.',
                                    icon: (
                                        <LifeBuoy className="text-oxford-blue mb-3 h-10 w-10" />
                                    ),
                                },
                            ].map((feature, index) => (
                                <Card
                                    key={index}
                                    className="text-center transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center">
                                            {feature.icon}
                                            <h3 className="text-oxford-blue mb-2 font-serif text-xl font-semibold">
                                                {feature.title}
                                            </h3>
                                            <p className="leading-relaxed text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Aims & Scope Section */}
                <div className="mb-8 space-y-8">
                    {/* Aims Section */}
                    <Card className="from-parchment/20 to-parchment/10 border-oxford-blue/20 bg-linear-to-r">
                        <CardHeader>
                            <CardTitle className="text-oxford-blue flex items-center gap-3 font-serif text-2xl">
                                <Target className="text-oxford-blue h-8 w-8" />
                                Aims
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {journalAbbreviation} serves as a primary
                                multidisciplinary channel for disseminating
                                high-quality original research and scholarly
                                communications. It aims to nurture vibrant
                                academic dialogue, encourage cross-disciplinary
                                approaches, and advance knowledge addressing
                                issues of local, national, and global
                                significance, ensuring impact and rigor through
                                robust peer review.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Scope Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-oxford-blue flex items-center gap-3 font-serif text-2xl">
                                <BookOpen className="text-oxford-blue h-8 w-8" />
                                Scope
                            </CardTitle>
                            <CardDescription>
                                Research areas and thematic focus of the journal
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                                {journalName} welcomes submissions of original
                                research articles, review papers, and case
                                studies that fall within its broad
                                multidisciplinary mandate. The journal is
                                particularly interested in contributions
                                addressing, but not limited to, the following
                                key thematic areas:
                            </p>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Mangyan and Multidisciplinary Indigenous Studies',
                                        description:
                                            'Research focusing on the Mangyan peoples of Mindoro, as well as broader studies concerning Indigenous communities, cultures, rights, and knowledge systems.',
                                    },
                                    {
                                        title: 'Agriculture, Aquaculture, and Agri-Innovation',
                                        description:
                                            'Studies on sustainable farming practices, fisheries management, food security, agricultural technology, and innovations in the agri-food sector.',
                                    },
                                    {
                                        title: 'Halcon and Highlands Biodiversity Conservation',
                                        description:
                                            'Research related to the unique ecosystems of Mount Halcon and other highland areas, focusing on biodiversity assessment, conservation strategies, and environmental protection.',
                                    },
                                    {
                                        title: 'AI, Automation, and Advanced Technologies',
                                        description:
                                            'Exploration of artificial intelligence, machine learning, automation, robotics, data science, and other emerging technologies and their applications across various sectors.',
                                    },
                                    {
                                        title: 'Livelihood, Local Economy, and Sustainable Enterprises',
                                        description:
                                            'Studies on community development, poverty alleviation, local economic growth, entrepreneurship, sustainable business models, and social enterprises.',
                                    },
                                    {
                                        title: 'Tamaraw and Terrestrial Wildlife Protection',
                                        description:
                                            'Research dedicated to the conservation of the endangered Tamaraw, other terrestrial wildlife, habitat management, and human-wildlife interactions.',
                                    },
                                    {
                                        title: 'Arts, Humanities, and Anthropological Studies',
                                        description:
                                            'Contributions exploring culture, history, language, literature, philosophy, ethics, visual and performing arts, and anthropological perspectives on human societies.',
                                    },
                                    {
                                        title: 'Naujan Lake and National Resources Management',
                                        description:
                                            'Research concerning the ecology, conservation, and sustainable management of Naujan Lake National Park and other vital natural resources (water, forests, minerals).',
                                    },
                                    {
                                        title: 'Advancement in Health, Human Security, and Holistic Well-being',
                                        description:
                                            'Studies focusing on public health, healthcare systems, disease prevention, community health, human security challenges, mental health, and approaches to holistic well-being.',
                                    },
                                ].map((item, index) => (
                                    <Card
                                        key={index}
                                        className="bg-muted/30 transition-shadow hover:shadow-md"
                                    >
                                        <CardContent className="pt-4">
                                            <div className="flex items-start gap-4">
                                                <span className="bg-oxford-blue flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <h3 className="text-oxford-blue mb-2 font-serif text-lg font-semibold">
                                                        {item.title}
                                                    </h3>
                                                    <p className="leading-relaxed text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Card className="mt-6 border-secondary/30 bg-linear-to-r from-secondary/20 to-secondary/10">
                                <CardContent className="pt-6">
                                    <p className="text-lg leading-relaxed text-muted-foreground">
                                        The journal encourages interdisciplinary
                                        research that connects these themes and
                                        welcomes contributions offering novel
                                        insights, methodologies, and solutions
                                        that significantly contribute to the
                                        advancement of the Sustainable
                                        Development Goals (SDGs) in both local
                                        and international contexts.
                                    </p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
