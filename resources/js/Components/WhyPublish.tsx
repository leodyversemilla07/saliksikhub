interface WhyPublishProps {
    benefits: string[];
    impactAndReach: string[];
    journalName: string;
}

export default function WhyPublish({ benefits, impactAndReach, journalName }: WhyPublishProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6">
                {/* Benefits for Authors */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Why Publish with Us?</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-6">
                            At { journalName }, we are committed to providing authors with an exceptional publishing experience. By publishing with us, you gain access to several key benefits that ensure your research reaches its full potential.
                        </p>
                        <ul className="list-disc ml-6 text-lg">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="mb-3">{benefit}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Impact and Reach */}
                <div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Impact and Reach</h2>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <p className="text-lg mb-6">
                            { journalName } has a broad readership and is actively promoted within academic, research, and professional communities. We are dedicated to increasing the visibility and impact of your research. Here’s how we help your work get noticed:
                        </p>
                        <ul className="list-disc ml-6 text-lg">
                            {impactAndReach.map((impact, index) => (
                                <li key={index} className="mb-3">{impact}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
