import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export default function Button({
    type = 'submit',
    className = '',
    disabled,
    children,
    variant = 'primary',
    fullWidth = false,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center border border-transparent rounded-md font-semibold transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
        primary: 'bg-[#18652C] hover:bg-[#3FB65E] focus:ring-[#18652C] text-white',
        secondary: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-70 cursor-not-allowed' : '';
    
    return (
        <button
            type={type}
            className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${disabledClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
