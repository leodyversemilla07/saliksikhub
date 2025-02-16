import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            {items.map((item, index) => (
                <div key={item.label} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary transition-colors duration-200"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-gray-900">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
