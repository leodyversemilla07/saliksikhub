interface HeroSectionProps {
    journalName: string;
    researchFocus: string;
    backgroundImageUrl: string;
}

export default function HeroSection({ journalName, researchFocus, backgroundImageUrl }: HeroSectionProps) {
    return (
        <section className="relative bg-cover bg-center h-[600px] text-white" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                    Welcome to {journalName}
                </h1>
                <p className="text-lg lg:text-xl max-w-3xl mb-6">
                    At {journalName}, we are dedicated to advancing the field of {researchFocus}. Our mission is to provide a platform for cutting-edge research, foster academic collaboration, and promote the dissemination of knowledge.
                </p>
                <div className="flex space-x-4">
                    <a href="#submit" className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                        Submit Your Paper
                    </a>
                    <a href="#explore" className="inline-block px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                        Explore Journals
                    </a>
                    <a href="#become-reviewer" className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                        Become a Reviewer
                    </a>
                </div>
            </div>
        </section>
    );
}
