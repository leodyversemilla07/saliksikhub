import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    delay?: number;
}

export function Section({ icon: Icon, title, children, delay = 0 }: SectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex items-start space-x-4"
        >
            <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1 drop-shadow-sm" />
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{title}</h2>
                {children}
            </div>
        </motion.div>
    );
}
