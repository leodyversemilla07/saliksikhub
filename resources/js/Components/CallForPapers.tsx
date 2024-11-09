interface CallsForPapersProps {
    currentCalls: string[];
    submissionDeadlines: string[];
}

export default function CallsForPapers({
    currentCalls,
    submissionDeadlines,
}: CallsForPapersProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6">
                {/* Current Calls for Papers */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Current Calls for Papers</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-6">
                            We are currently accepting submissions for the following special issues and research themes. Explore the topics below and submit your manuscript for consideration.
                        </p>
                        <ul className="list-disc ml-6 text-lg">
                            {currentCalls.map((call, index) => (
                                <li key={index} className="mb-3">{call}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Submission Deadlines */}
                <div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Submission Deadlines</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-6">
                            Ensure that your submissions are completed before the following deadlines for upcoming issues:
                        </p>
                        <ul className="list-disc ml-6 text-lg">
                            {submissionDeadlines.map((deadline, index) => (
                                <li key={index} className="mb-3">{deadline}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
