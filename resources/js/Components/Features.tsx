import { BookOpen, Users, TrendingUp, Globe } from "lucide-react"

const features = [
    {
        name: "Peer-Reviewed",
        description: "All articles undergo a rigorous peer-review process to ensure high-quality research publications.",
        icon: Users,
    },
    {
        name: "Open Access",
        description: "MinSU Research Journal provides free and unrestricted access to all published articles.",
        icon: Globe,
    },
    {
        name: "Multidisciplinary",
        description: "We publish research from various academic disciplines, fostering a diverse scholarly community.",
        icon: BookOpen,
    },
    {
        name: "Impact Tracking",
        description: "Track the impact of your research with comprehensive citation and usage analytics.",
        icon: TrendingUp,
    },
]

export default function Features() {
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-[#18652c] font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Why Publish with MinSU Research Journal
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        MinSU Research Journal offers a platform for researchers to publish and disseminate their work to a global
                        audience.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#3fb65e] text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-[#18652c]">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
