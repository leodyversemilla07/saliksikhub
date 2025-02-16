import { LuBookOpen, LuUsers, LuTrendingUp, LuGlobe } from "react-icons/lu";

const features = [
    {
        name: "Peer-Reviewed",
        description: "All articles undergo a rigorous peer-review process to ensure high-quality research publications.",
        icon: LuUsers,
    },
    {
        name: "Open Access",
        description: "MinSU Research Journal provides free and unrestricted access to all published articles.",
        icon: LuGlobe,
    },
    {
        name: "Multidisciplinary",
        description: "We publish research from various academic disciplines, fostering a diverse scholarly community.",
        icon: LuBookOpen,
    },
    {
        name: "Impact Tracking",
        description: "Track the impact of your research with comprehensive citation and usage analytics.",
        icon: LuTrendingUp,
    },
]

export default function Features() {
    return (
        <div className="py-24 bg-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center space-y-4 mb-16">
                    <h2 className="inline-block font-semibold text-[#18652c] text-lg uppercase tracking-wide bg-green-100 px-4 py-2 rounded-full">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                        Elevate Your Research Impact
                    </p>
                    <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 leading-relaxed">
                        Join a prestigious community of scholars and gain global visibility for your work through our innovative publishing platform.
                    </p>
                </div>

                <div className="mt-16">
                    <dl className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="bg-white relative p-8 rounded-2xl shadow-lg"
                            >
                                <div>
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white">
                                        <feature.icon className="h-8 w-8" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
