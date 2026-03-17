import React from 'react';

interface DocumentViewerProps {
    pdfPath?: string | null;
    docxPath?: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ pdfPath, docxPath }) => {
    if (pdfPath) {
        return (
            <object 
                data={pdfPath} 
                type="application/pdf" 
                className="rounded-lg shadow border mx-auto w-full max-w-full max-h-[80vh] aspect-[210/297] bg-card border-border"
                style={{ 
                    width: '210mm',
                    height: '297mm'
                }}
            >
                <div className="mb-4 text-center text-base text-muted-foreground">
                    PDF preview is not available in-browser.<br />
                    <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="underline text-sm text-primary">Open PDF in New Tab</a>
                    <span className="mx-2">|</span>
                    <a href={pdfPath} download className="underline text-xs text-accent">Download PDF</a>
                </div>
            </object>
        );
    } else if (docxPath) {
        return (
            <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docxPath)}`}
                title="Word Document Viewer"
                className="rounded-lg shadow border mx-auto w-full max-w-full max-h-[80vh] aspect-[210/297] bg-card border-border"
                style={{ 
                    border: 'none',
                    width: '210mm',
                    height: '297mm'
                }}
                allowFullScreen
            />
        );
    } else {
        return (
            <div className="text-center p-8 w-full text-muted-foreground">
                <div>No document available.</div>
            </div>
        );
    }
};

export default DocumentViewer;
