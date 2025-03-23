import { Link } from '@inertiajs/react'
import { LuMousePointerClick, LuFilePlus2 } from "react-icons/lu";

export default function Hero() {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden opacity-20 blur-3xl">
                        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#18652c] to-[#3fb65e]"></div>
                    </div>

                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                                <span className="block xl:inline animate-fade-in-down">Advancing Knowledge</span>{" "}
                                <span className="block text-[#18652c] xl:inline animate-fade-in-down delay-100">
                                    Through Innovation
                                </span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0 animate-fade-in-up delay-200">
                                MinSU Research Journal: A premier platform for groundbreaking interdisciplinary research,
                                fostering academic excellence and global collaboration.
                            </p>
                            <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <Link
                                        href="/submissions"
                                        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-[#18652c] to-[#3fb65e] hover:from-[#0d3318] hover:to-[#1c5d31] md:py-4 md:text-lg md:px-12 transition-all duration-300 ease-in-out"
                                    >
                                        Submit Manuscript
                                        <LuFilePlus2 className="ml-2 text-xl" />
                                    </Link>
                                </div>
                                <div className="rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <Link
                                        href="/current"
                                        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#18652c] text-base font-semibold rounded-lg text-[#18652c] bg-transparent hover:bg-gradient-to-r hover:from-[#0d3318] hover:to-[#1c5d31] hover:border-transparent hover:text-white md:py-4 md:text-lg md:px-12 transition-all duration-300 ease-in-out"
                                    >
                                        Explore Issues
                                        <LuMousePointerClick className="ml-2 text-xl" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="relative h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full">
                    <img
                        src='/images/hero.jpg'
                        alt="Research collaboration"
                        className="absolute inset-0 h-full w-full object-cover transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent"></div>
                </div>
            </div>
        </div>
    );
}