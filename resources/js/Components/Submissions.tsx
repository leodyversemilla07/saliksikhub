interface SubmissionsProps {
    authorInstructions: string;
    submissionProcess: string;
}

export default function Submissions({
    authorInstructions,
    submissionProcess,
}: SubmissionsProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6">
                {/* Author Instructions */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Author Instructions</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg">{authorInstructions}</p>
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-green-600">Templates & Formatting Guidelines:</h3>
                            <ul className="list-disc ml-6 text-lg">
                                <li>Manuscripts should be submitted in Microsoft Word or LaTeX format.</li>
                                <li>The text should be formatted with 1.5 line spacing and a 12-point font size.</li>
                                <li>References should follow the APA citation style.</li>
                                <li>Please use the provided submission template available on our website.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Submission Process Overview */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Submission Process Overview</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-6">{submissionProcess}</p>
                        <div>
                            <h3 className="text-xl font-semibold text-green-600">Step-by-Step Guide:</h3>
                            <ol className="list-decimal ml-6 text-lg">
                                <li className="mb-3">
                                    <strong>Step 1:</strong> Register as an author on our submission portal.
                                </li>
                                <li className="mb-3">
                                    <strong>Step 2:</strong> Upload your manuscript file, including all supplementary materials (figures, tables, etc.).
                                </li>
                                <li className="mb-3">
                                    <strong>Step 3:</strong> Fill out the submission form with necessary information such as title, authors, and abstract.
                                </li>
                                <li className="mb-3">
                                    <strong>Step 4:</strong> Review the submission and confirm the accuracy of all details.
                                </li>
                                <li className="mb-3">
                                    <strong>Step 5:</strong> Submit the manuscript for peer review and wait for a confirmation email.
                                </li>
                                <li>
                                    <strong>Step 6:</strong> Follow the progress of your submission and review comments through your author portal.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
