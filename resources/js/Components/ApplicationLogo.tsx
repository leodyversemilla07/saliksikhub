import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="https://minsu.edu.ph/template/images/logo.png" // Replace with the actual path to your image
            alt="MinSU Logo"
        />
    );
}
