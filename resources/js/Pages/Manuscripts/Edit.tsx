import { ChangeEvent, FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import { AlertCircle, FileText, Save, X, Upload } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

interface Manuscript {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    keywords: string;
    manuscript_path?: string;
}

interface EditProps {
    manuscript: Manuscript;
}

/**
 * A reusable component to display form errors.
 */
const FormError = ({ errors }: { errors: Record<string, string> }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-destructive/15 border-l-4 border-destructive p-4 mb-6 rounded"
        >
            <div className="flex">
                <AlertCircle className="w-6 h-6 text-destructive mr-3" />
                <ul className="list-disc pl-5 space-y-1 text-destructive">
                    {Object.keys(errors).map((key) => (
                        <li key={key}>{errors[key]}</li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default function Edit({ manuscript }: EditProps) {
    const { data, setData, put, errors } = useForm({
        title: manuscript.title || "",
        authors: manuscript.authors || "",
        abstract: manuscript.abstract || "",
        keywords: manuscript.keywords || "",
        manuscript_file: null as File | null,
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData("manuscript_file", e.target.files[0]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route("manuscripts.update", manuscript.id), {
            preserveScroll: true,
            onSuccess: () => setData("manuscript_file", null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Manuscript" />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-3xl font-bold text-gray-900">
                                <FileText className="w-8 h-8 text-primary mr-4" />
                                Edit Manuscript
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(errors).length > 0 && (
                                <FormError errors={errors as Record<string, string>} />
                            )}

                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    {/* Title Field */}
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Title
                                        </label>
                                        <Input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Authors Field */}
                                    <div>
                                        <label
                                            htmlFor="authors"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Authors
                                        </label>
                                        <Input
                                            type="text"
                                            id="authors"
                                            name="authors"
                                            value={data.authors}
                                            onChange={(e) => setData("authors", e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Abstract Field */}
                                    <div>
                                        <label
                                            htmlFor="abstract"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Abstract
                                        </label>
                                        <Textarea
                                            id="abstract"
                                            name="abstract"
                                            rows={5}
                                            value={data.abstract}
                                            onChange={(e) => setData("abstract", e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Keywords Field */}
                                    <div>
                                        <label
                                            htmlFor="keywords"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Keywords
                                        </label>
                                        <Input
                                            type="text"
                                            id="keywords"
                                            name="keywords"
                                            value={data.keywords}
                                            onChange={(e) => setData("keywords", e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* File Upload Field */}
                                    <div>
                                        <label
                                            htmlFor="manuscript_file"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Upload Manuscript (PDF only)
                                        </label>
                                        <div className="flex items-center">
                                            <label htmlFor="manuscript_file" className="flex-grow cursor-pointer">
                                                <Input
                                                    type="file"
                                                    id="manuscript_file"
                                                    name="manuscript_file"
                                                    accept="application/pdf"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
                                                    <Upload className="w-5 h-5 mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {data.manuscript_file
                                                            ? data.manuscript_file.name
                                                            : "Choose file"}
                                                    </span>
                                                </div>
                                            </label>
                                            {data.manuscript_file && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setData("manuscript_file", null)}
                                                    className="ml-2 text-destructive hover:text-destructive/90"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </div>
                                        {manuscript.manuscript_path && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <strong>Current Manuscript:</strong>{" "}
                                                <a
                                                    href={`/author/manuscripts/${manuscript.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary/90 underline"
                                                >
                                                    View Manuscript
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex justify-between items-center pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        Update
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => (window.location.href = route("manuscripts.index"))}
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
