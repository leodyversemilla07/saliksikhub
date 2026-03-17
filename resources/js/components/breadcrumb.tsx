import { Link } from '@inertiajs/react';
import React from 'react';
import {
    Breadcrumb as BreadcrumbUI,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from './ui/breadcrumb';

type BreadcrumbItemType = {
    label: string;
    href?: string;
    isCurrent?: boolean;
};

interface BreadcrumbProps {
    items: BreadcrumbItemType[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <BreadcrumbUI>
            <BreadcrumbList>
                {items.map((item, idx) => (
                    <React.Fragment key={item.label + idx}>
                        <BreadcrumbItem>
                            {item.href && !item.isCurrent ? (
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {idx < items.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </BreadcrumbUI>
    );
};

export default Breadcrumb;
