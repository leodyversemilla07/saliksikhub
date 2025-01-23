import { Link } from "@inertiajs/react"

export default function Cta() {
    return (
        <div className="bg-[#18652c]">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to contribute to academic knowledge?</span>
                    <span className="block">Submit your research to MinSU Research Journal today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-[#c0e4ca]">
                    Join our community of researchers and share your findings with a global audience.
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            href="/submissions"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#18652c] bg-white hover:bg-green-50 transition duration-150"
                        >
                            Submit Your Manuscript
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex">
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#18652c] hover:bg-[#3fb65e] transition duration-150"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}



