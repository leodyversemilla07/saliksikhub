interface AboutProps {
    mission: string;
    vision: string;
    editorialBoard: string;
    scope: string;
    impactFactor?: string;
    indexingServices?: string;
}

export default function About({
    mission,
    vision,
    editorialBoard,
    scope,
    impactFactor,
    indexingServices,
}: AboutProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6">
                {/* Mission & Vision */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Mission & Vision</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-4">
                            <strong>Mission:</strong> {mission}
                        </p>
                        <p className="text-lg">
                            <strong>Vision:</strong> {vision}
                        </p>
                    </div>
                </div>

                {/* Editorial Board */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Editorial Board</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg">{editorialBoard}</p>
                    </div>
                </div>

                {/* Scope of the Journal */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Scope of the Journal</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg">{scope}</p>
                    </div>
                </div>

                {/* Impact Factor & Indexing */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Impact Factor & Indexing</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        {impactFactor && (
                            <p className="text-lg mb-2">
                                <strong>Impact Factor:</strong> {impactFactor}
                            </p>
                        )}
                        {indexingServices && (
                            <p className="text-lg">
                                <strong>Indexing Services:</strong> {indexingServices}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
