import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Mail, ExternalLink, Users, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';

interface BoardMember {
    name: string
    role: string
    category?: string
    affiliation: string
    imageUrl: string
    bio: string
    email: string
    linkedin?: string
    twitter?: string
    researchInterests?: string[]
    publications?: number
    citations?: number
    hIndex?: number
    education?: string
    expertise?: string[]
    website?: string
    location?: string
}

interface EditorialCategory {
    title: string
    description: string
    members: BoardMember[]
}

interface EditorialBoardProps extends PageProps {
    boardCategories?: EditorialCategory[];
}

const categoryIcons = [Users, BookOpen, Award, Users];

export default function EditorialBoard({ boardCategories = [] }: EditorialBoardProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    return (
        <PublicLayout title={`Editorial Board | ${journalName}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-12">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-oxford-blue mb-4">
                            Editorial Board
                        </h1>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Our editorial board comprises internationally recognized scholars and experts who bring diverse perspectives and profound expertise to advance the mission of {journalName}.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Board Members Display */}
                    {boardCategories.length > 0 ? (
                        <div className="space-y-12">
                            {boardCategories.map((category, categoryIndex) => {
                                const IconComponent = categoryIcons[categoryIndex % categoryIcons.length];
                                return (
                                    <Card key={categoryIndex}>
                                        <CardHeader>
                                            <CardTitle className="font-serif text-2xl flex items-center gap-3 text-oxford-blue">
                                                <IconComponent className="h-6 w-6 text-oxford-blue" />
                                                {category.title}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {category.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {category.members.map((member, index) => (
                                                    <BoardMemberCard key={index} member={member} />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-16">
                                <div className="text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Editorial Board Coming Soon
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        The editorial board information for {journalName} is being prepared.
                                        Please check back later.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
        </PublicLayout>
    );
}

function BoardMemberCard({ member }: { member: BoardMember }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src={member.imageUrl}
                                alt={member.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-lg">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow space-y-4">
                        {/* Name and Basic Info */}
                        <div>
                            <h3 className="font-serif text-xl font-semibold text-oxford-blue mb-1">
                                {member.name}
                            </h3>
                            <p className="text-sm text-burgundy font-medium mb-1">
                                {member.role}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {member.affiliation}
                            </p>
                            {member.location && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {member.location}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        {member.education && (
                            <div>
                                <h4 className="font-sans text-sm font-medium text-oxford-blue mb-1">Education</h4>
                                <p className="text-sm text-muted-foreground">{member.education}</p>
                            </div>
                        )}

                        {/* Bio */}
                        <div>
                            <h4 className="font-sans text-sm font-medium text-oxford-blue mb-1">Biography</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {member.bio}
                            </p>
                        </div>

                        {/* Academic Metrics */}
                        {(member.publications || member.citations || member.hIndex) && (
                            <div>
                                <h4 className="font-sans text-sm font-medium text-oxford-blue mb-2">Academic Impact</h4>
                                <div className="flex gap-4">
                                    {member.publications && (
                                        <div className="text-center">
                                            <div className="font-serif text-lg font-bold text-oxford-blue">{member.publications}</div>
                                            <div className="text-xs text-muted-foreground">Publications</div>
                                        </div>
                                    )}
                                    {member.citations && (
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-primary">{member.citations}</div>
                                            <div className="text-xs text-muted-foreground">Citations</div>
                                        </div>
                                    )}
                                    {member.hIndex && (
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-primary">{member.hIndex}</div>
                                            <div className="text-xs text-muted-foreground">H-Index</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Research Interests */}
                        {member.researchInterests && member.researchInterests.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-2">Research Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.researchInterests.map((interest, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expertise Areas */}
                        {member.expertise && member.expertise.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-2">Areas of Expertise</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.expertise.map((area, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {area}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact and Social Links */}
                        <Separator />
                        <div className="flex flex-wrap gap-4">
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email
                                </a>
                            )}
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    LinkedIn
                                </a>
                            )}
                            {member.website && (
                                <a
                                    href={member.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Website
                                </a>
                            )}
                            {member.twitter && (
                                <a
                                    href={member.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Twitter
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
