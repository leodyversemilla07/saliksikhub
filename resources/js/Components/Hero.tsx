import { Link } from '@inertiajs/react'

export default function Hero() {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    {/* Decorative background element */}
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
                                <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Link
                                        href="/submissions"
                                        className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-[#18652c] to-[#3fb65e] hover:from-[#134724] hover:to-[#2e8d4e] md:py-4 md:text-lg md:px-12 transition-all duration-200 transform hover:scale-105"
                                    >
                                        Submit Manuscript
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                    <Link
                                        href="/current"
                                        className="w-full flex items-center justify-center px-8 py-3.5 border-2 border-[#18652c] text-base font-semibold rounded-lg text-[#18652c] bg-transparent hover:border-[#134724] hover:text-[#134724] md:py-4 md:text-lg md:px-12 transition-all duration-200 transform hover:scale-105"
                                    >
                                        Explore Issues
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 animate-fade-in-up delay-300">
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-[#18652c]">200+</div>
                                    <div className="mt-1 text-sm font-medium text-gray-500">Published Papers</div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-[#18652c]">50+</div>
                                    <div className="mt-1 text-sm font-medium text-gray-500">Global Collaborations</div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Image Section with Gradient Overlay */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="relative h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full">
                    <img
                        src='storage/images/hero.jpg'
                        alt="Research collaboration"
                        className="absolute inset-0 h-full w-full object-cover transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent"></div>
                </div>
            </div>
        </div>
    );
}