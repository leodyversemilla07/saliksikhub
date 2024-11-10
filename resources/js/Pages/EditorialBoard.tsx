import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function EditorialBoard({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    // Sample data - Replace with dynamic data from your backend
    const boardMembers = [
        {
            id: 1,
            name: "Dr. John Doe",
            role: "Editor-in-Chief",
            photoUrl: "https://franchisematch.com/wp-content/uploads/2015/02/john-doe.jpg",
            bio: "Dr. John Doe is a professor of Computer Science with over 20 years of experience in artificial intelligence research...",
            email: "johndoe@example.com",
            profileUrl: "/profile/johndoe",
        },
        {
            id: 2,
            name: "Dr. Jane Smith",
            role: "Associate Editor",
            photoUrl: "https://westernfinance.org/wp-content/uploads/speaker-2-v2.jpg",
            bio: "Dr. Jane Smith specializes in data security and privacy and has published extensively in these areas...",
            email: "janesmith@example.com",
            profileUrl: "/profile/janesmith",
        },
        {
            id: 3,
            name: "Dr. Bob Stark",
            role: "Associate Editor",
            photoUrl: "https://media.licdn.com/dms/image/C4E03AQGJOYQ9kZo1aQ/profile-displayphoto-shrink_200_200/0/1615767681032?e=2147483647&v=beta&t=5pKSYxsvoghV6AY4OYCRFQ3mu4Al5GClVzGaQ9YqMIA  ",
            bio: "Dr. Bob Star specializes in data security and privacy and has published extensively in these areas...",
            email: "bobstark@example.com",
            profileUrl: "/profile/bobstark",
        },
        {
            id: 4,
            name: "Dr. Alice Guo",
            role: "Associate Editor",
            photoUrl: "https://birikfestival.com/wp-content/uploads/2015/04/speaker-1-v2.jpg",
            bio: "Dr. Alice Guo specializes in data security and privacy and has published extensively in these areas...",
            email: "aliceguo@example.com",
            profileUrl: "/profile/aliceguo",
        },
        // Add more board members as needed
    ];

    return (
        <>
            <Head title="Editorial Boord" />


            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />
            <div className="max-w-screen-lg mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Editorial Board</h1>
                <p className="text-gray-600 mb-8">Meet the esteemed members of our editorial board who ensure the quality and integrity of our published research.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {boardMembers.map((member) => (
                        <div key={member.id} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={member.photoUrl}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-gray-600 text-sm">{member.role}</p>
                                    <p className="text-gray-500 text-sm mt-2">{member.email}</p>
                                    <Link href={member.profileUrl} className="text-green-600 font-semibold hover:underline mt-4 block">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                            <p className="text-gray-700 mt-4">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer
                journalName={journalName}
            />
        </>
    );
}
