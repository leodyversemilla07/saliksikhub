import React from 'react';
import { Toaster } from "@/Components/ui/toaster";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
            <Toaster /> {/* This ensures toasts are globally available */}
        </div>
    );
};

export default RootLayout;