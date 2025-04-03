import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    showHomeIcon?: boolean;
    maxLength?: number;
}

export function Breadcrumb({
    items,
    className,
    showHomeIcon = true,
    maxLength
}: BreadcrumbProps) {
    return (
        <nav className={twMerge("flex flex-wrap items-center text-sm text-gray-600 mb-6", className)}>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />}

                    {index === 0 && showHomeIcon && !item.icon ? (
                        <div className="flex items-center">
                            <Home className="w-4 h-4 mr-1 text-gray-500" />
                            {renderItem(item, maxLength)}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            {renderItem(item, maxLength)}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}

function renderItem(item: BreadcrumbItem, maxLength?: number) {
    const label = maxLength && item.label.length > maxLength
        ? `${item.label.substring(0, maxLength)}...`
        : item.label;

    if (item.href) {
        return (
            <Link
                href={item.href}
                className="hover:text-primary transition-colors duration-200 hover:underline"
                title={item.label}
            >
                {label}
            </Link>
        );
    }

    return <span className="font-medium text-gray-900" title={item.label}>{label}</span>;
}
