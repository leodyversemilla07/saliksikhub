import { useState, useEffect } from 'react';
import { FileDown, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface PDFViewerProps {
    url: string;
    title: string;
}

export function PDFViewer({ url, title }: PDFViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const checkUrl = async (url: string) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const validateUrl = async () => {
            setIsLoading(true);
            const isAccessible = await checkUrl(url);

            if (!isAccessible) {
                setHasError(true);
            }
            setIsLoading(false);
        };

        validateUrl();
    }, [url]);

    return (
        <div className="space-y-4">
            <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-lg min-h-[600px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                            <p className="text-gray-600 font-medium">Loading preview...</p>
                        </div>
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="text-center p-4">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-500 font-medium mb-4">Unable to load PDF preview</p>
                            <Button
                                onClick={() => window.open(url, '_blank')}
                                className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 
                                         hover:from-green-700 hover:via-green-600 hover:to-yellow-600
                                         text-white font-semibold tracking-tight shadow-md"
                            >
                                Open PDF in new tab
                            </Button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={url}
                        className="w-full h-[600px]"
                        style={{ border: 'none' }}
                        title={`${title} Preview`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setHasError(true)}
                    />
                )}
            </div>

            <Button
                onClick={() => window.open(url, '_blank')}
                className="w-full bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 
                         hover:from-green-700 hover:via-green-600 hover:to-yellow-600
                         text-white font-semibold tracking-tight shadow-md
                         transition-colors duration-200"
            >
                <FileDown className="w-5 h-5 mr-2 drop-shadow" />
                Download Manuscript
            </Button>
        </div>
    );
}
