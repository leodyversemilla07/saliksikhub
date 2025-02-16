import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, User, Clock, Tag, FileDown, AlertCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PDFViewer } from '@/Components/PDFViewer';
import { Breadcrumb } from '@/Components/Breadcrumb';
import { Section } from '@/Components/ui/Section';
import { StatusBadge } from '@/Components/ui/StatusBadge';
import { Manuscript } from '@/types/manuscript';

interface ShowProps {
    manuscript: Manuscript;
}

export default function Show({ manuscript }: ShowProps): JSX.Element {
    return (
        <AuthenticatedLayout>
            <Head title={`Manuscript: ${manuscript.title}`} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Breadcrumb
                        items={[
                            { label: 'Manuscripts', href: '/author/manuscripts/index' },
                            { label: manuscript.title }
                        ]}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 p-8 md:p-10">
                                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                                <div className="relative">
                                    <StatusBadge status={manuscript.status} />
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mt-4 break-words leading-tight tracking-tight drop-shadow-md">
                                        {manuscript.title}
                                    </h1>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="grid gap-8 md:gap-12">
                                    <Section icon={User} title="Authors" delay={0.1}>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.authors.map((author) => (
                                                <span
                                                    key={author}
                                                    className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
                                                             text-gray-900 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    {author}
                                                </span>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section icon={FileText} title="Abstract" delay={0.2}>
                                        <p className="text-gray-800 leading-relaxed">{manuscript.abstract}</p>
                                    </Section>

                                    <Section icon={Tag} title="Keywords" delay={0.3}>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.keywords.map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="inline-flex items-center px-3 py-1 rounded-full
                                                             bg-gradient-to-r from-green-100 to-yellow-100
                                                             text-green-800 font-medium text-sm
                                                             border border-green-200/50 shadow-sm"
                                                >
                                                    <Tag className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section icon={FileDown} title="Manuscript File" delay={0.4}>
                                        {manuscript.manuscript_url ? (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <PDFViewer url={manuscript.manuscript_url} title={manuscript.title} />
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 text-red-700 rounded-lg p-4 flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5" />
                                                <p className="font-medium">No manuscript file available.</p>
                                            </div>
                                        )}
                                    </Section>

                                    <Section icon={Clock} title="Timeline" delay={0.5}>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Created', date: manuscript.created_at },
                                                { label: 'Last Updated', date: manuscript.updated_at }
                                            ].map(({ label, date }) => (
                                                <div key={label} className="flex items-center gap-4">
                                                    <div className="w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                                                        <p className="text-sm text-gray-700">
                                                            {new Date(date).toLocaleDateString(undefined, {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

