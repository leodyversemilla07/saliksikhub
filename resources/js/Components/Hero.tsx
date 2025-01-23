import { Link } from '@inertiajs/react'

export default function Hero() {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>

                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Advancing Knowledge</span>{" "}
                                <span className="block text-[#18652c] xl:inline">Through Research</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                MinSU Research Journal is a peer-reviewed publication committed to showcasing high-quality research from
                                MinSU and beyond, advancing knowledge across various disciplines.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        href="/submissions"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#18652c] hover:bg-[#3fb65e] md:py-4 md:text-lg md:px-10 transition duration-150"
                                    >
                                        Submit Manuscript
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        href="/current"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#18652c] bg-[#3fb65e]/20 hover:bg-[#3fb65e]/30 md:py-4 md:text-lg md:px-10 transition duration-150"
                                    >
                                        Current Issue
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    src='storage/images/hero_image.jpg'
                    alt="Research collage"
                    width={1920}
                    height={1080}
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                />
            </div>
        </div>
    );
}