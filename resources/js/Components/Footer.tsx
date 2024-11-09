import React from 'react';
import { Link } from '@inertiajs/react';

interface FooterProps {
    journalName: string;
}

export default function Footer({ journalName }: FooterProps): React.ReactElement {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Footer Links */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className="text-xl font-bold text-white">{journalName}</div>
                    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <Link href="#" className="hover:text-white">Current</Link>
                        <Link href="#" className="hover:text-white">Submissions</Link>
                        <Link href="#" className="hover:text-white">Archives</Link>
                        <Link href="#" className="hover:text-white">Editorial Board</Link>
                        <Link href="#" className="hover:text-white">About Us</Link>
                        <Link href="#" className="hover:text-white">Contact Us</Link>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-8 text-center border-t border-gray-700 pt-8 pb-8">
                    <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
                    <p className="text-sm text-gray-400 mb-4">Sign up for the latest news, calls for papers, and journal updates.</p>
                    <form className="flex justify-center">
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="px-4 py-2 text-gray-900 rounded-l-md"
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700">
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Social Media and Contact Info */}
                <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-700">
                    <div className="text-sm text-center lg:text-left">© 2024 {journalName} · Privacy · Terms · Sitemap</div>
                    <div className="flex space-x-10 mt-4 lg:mt-0">
                        <button className="p-2 hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
