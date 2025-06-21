import { Link } from '@inertiajs/react';
import {
    Breadcrumb as UiBreadcrumb,
    BreadcrumbList,
    BreadcrumbItem as UiBreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
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
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <UiBreadcrumb className={cn("mb-8", className)}>
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const label = maxLength && item.label.length > maxLength
                        ? `${item.label.substring(0, maxLength)}...`
                        : item.label;

                    return (
                        <div key={index} className="flex items-center">
                            <UiBreadcrumbItem>
                                {item.href && !isLast ? (
                                    <BreadcrumbLink 
                                        asChild
                                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                        title={item.label}
                                    >
                                        <Link href={item.href}>
                                            {label}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage 
                                        className="text-green-600 dark:text-green-400 font-medium"
                                        title={item.label}
                                    >
                                        {label}
                                    </BreadcrumbPage>
                                )}
                            </UiBreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </UiBreadcrumb>
    );
}
