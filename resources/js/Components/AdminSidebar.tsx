import { LayoutDashboard, FileText, Bot, ClipboardCheck, UserCheck, Users, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

export default function AdminSidebar({ activePage, setActivePage }: SidebarProps) {
    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        {/* Replace 'AI' text with an icon */}
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">SaliksikHub</h1>
                        <p className="text-xs text-gray-500">AI-Enhanced Research Platform</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard },
                        { name: 'Manuscripts', icon: FileText },
                        { name: 'AI Pre-review', icon: Bot },
                        { name: 'Peer Review', icon: ClipboardCheck },
                        { name: 'Reviewers', icon: UserCheck },
                        { name: 'Authors', icon: Users },
                        { name: 'Research Areas', icon: BookOpen },
                        { name: 'Settings', icon: Settings }
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActivePage(item.name)}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg text-left
                                ${activePage === item.name
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
