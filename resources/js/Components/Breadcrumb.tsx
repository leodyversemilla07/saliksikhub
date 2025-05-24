import { Link } from '@inertiajs/react';
import { twMerge } from 'tailwind-merge';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    maxLength?: number;
}

export function Breadcrumb({
    items,
    className,
    maxLength
}: BreadcrumbProps) {
    return (
        <nav className={twMerge("mb-8 text-sm text-gray-500 dark:text-gray-400", className)}>
            {items.map((item, index) => (
                <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    {renderItem(item, index === items.length - 1, maxLength)}
                </span>
            ))}
        </nav>
    );
}

function renderItem(item: BreadcrumbItem, isLast: boolean, maxLength?: number) {
    const label = maxLength && item.label.length > maxLength
        ? `${item.label.substring(0, maxLength)}...`
        : item.label;

    if (item.href && !isLast) {
        return (
            <Link
                href={item.href}
                className="hover:underline text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300"
                title={item.label}
            >
                {label}
            </Link>
        );
    }

    return <span title={item.label}>{label}</span>;
}
