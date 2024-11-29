import React, { ChangeEvent, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { AlertCircle, FileText, Save, X } from "lucide-react";

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

const Edit: React.FC<EditProps> = ({ manuscript }) => {
    const { data, setData, put, errors } = useForm({
        title: manuscript.title || "",
        authors: manuscript.authors || "",
        abstract: manuscript.abstract || "",
        keywords: manuscript.keywords || "",
        manuscript_file: null as File | null,
    });

    // Handling file selection and setting the data
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setData("manuscript_file", file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route("manuscripts.update", manuscript.id), {
            preserveScroll: true,
            onSuccess: () => {
                setData("manuscript_file", null); // Reset file data after submit
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <div className="flex items-center mb-8">
                        <FileText className="w-10 h-10 text-green-600 mr-4" />
                        <h1 className="text-3xl font-bold text-gray-900">Edit Manuscript</h1>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="flex">
                                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                                <div>
                                    <ul className="list-disc pl-5 space-y-1 text-red-700">
                                        {Object.keys(errors).map((key) => (
                                            <li key={key}>{(errors as Record<string, string>)[key]}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
                                Authors
                            </label>
                            <input
                                type="text"
                                id="authors"
                                name="authors"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.authors}
                                onChange={(e) => setData("authors", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                                Abstract
                            </label>
                            <textarea
                                id="abstract"
                                name="abstract"
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.abstract}
                                onChange={(e) => setData("abstract", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                                Keywords
                            </label>
                            <input
                                type="text"
                                id="keywords"
                                name="keywords"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.keywords}
                                onChange={(e) => setData("keywords", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="manuscript_file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Manuscript (PDF only)
                            </label>
                            <div className="flex items-center">
                                <label className="flex-grow">
                                    <input
                                        type="file"
                                        id="manuscript_file"
                                        name="manuscript_file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <span className="w-full inline-block px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        {data.manuscript_file ? data.manuscript_file.name : 'Choose file'}
                                    </span>
                                </label>
                                {data.manuscript_file && (
                                    <button
                                        type="button"
                                        onClick={() => setData("manuscript_file", null)}
                                        className="ml-2 text-red-500 hover:text-red-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {manuscript.manuscript_path && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <strong>Current Manuscript:</strong>{" "}
                                    <a
                                        href={`/manuscripts/${manuscript.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                        View Manuscript
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Update
                            </button>
                            <a
                                href={route("manuscripts.index")}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;
