import { Link } from "@inertiajs/react"

export default function Cta() {
    return (
        <div className="relative bg-gradient-to-br from-[#18652c] via-[#134d25] to-[#0a2e16] overflow-hidden isolate">
            <div className="absolute inset-0 opacity-15 animate-gradient-x">
                <div className="absolute w-[200%] h-full bg-[url('/storage/svg/pattern.svg')] bg-center bg-repeat opacity-25 animate-pan" />
            </div>

            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(180deg,transparent_30%,white)]" />
            </div>

            <div className="max-w-7xl mx-auto text-center py-28 px-4 sm:px-6 lg:px-8">
                <div className="relative space-y-10">
                    <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight tracking-tight">
                        <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-200 to-cyan-100 pb-2 px-2 -skew-y-3 transform">
                            Shape the Future of
                            <span className="block mt-2 text-7xl font-black text-emerald-400 drop-shadow-lg">
                                Academic Research
                            </span>
                        </span>
                        <span className="block mt-8 text-3xl font-semibold text-emerald-100/90 bg-white/5 backdrop-blur-sm py-4 px-6 rounded-2xl border border-white/10 shadow-lg">
                            Submit Your Work to MinSU Research Journal
                        </span>
                    </h2>

                    <p className="mx-auto max-w-2xl text-xl leading-8 text-emerald-50/90 font-light">
                        Join our prestigious community of scholars and contribute to meaningful academic discourse
                        that reaches a <span className="font-medium text-white">global audience</span> of researchers
                        and professionals.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link
                            href="/submissions"
                            className="group relative flex items-center justify-center px-10 py-5 bg-emerald-100/90 hover:bg-white text-emerald-900 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300"
                        >
                            <div className="absolute -inset-1 rounded-2xl bg-white/30 opacity-0 group-hover:opacity-100 blur-md transition-all duration-300" />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Submit Manuscript
                        </Link>

                        <Link
                            href="/about"
                            className="group relative flex items-center justify-center px-10 py-5 border-2 border-emerald-200/50 text-emerald-50 hover:text-white hover:border-white/80 text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 opacity-90 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Journal Details
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-4 text-sm font-medium text-emerald-200/90">
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Peer-Reviewed
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Open Access
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h12V4H4zm3 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Indexed
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}