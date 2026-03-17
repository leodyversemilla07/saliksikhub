import React from 'react';

interface DocumentViewerProps {
    pdfPath?: string | null;
    docxPath?: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
    pdfPath,
    docxPath,
}) => {
    if (pdfPath) {
        return (
            <object
                data={pdfPath}
                type="application/pdf"
                className="mx-auto aspect-[210/297] max-h-[80vh] w-full max-w-full rounded-lg border border-border bg-card shadow"
                style={{
                    width: '210mm',
                    height: '297mm',
                }}
            >
                <div className="mb-4 text-center text-base text-muted-foreground">
                    PDF preview is not available in-browser.
                    <br />
                    <a
                        href={pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline"
                    >
                        Open PDF in New Tab
                    </a>
                    <span className="mx-2">|</span>
                    <a
                        href={pdfPath}
                        download
                        className="text-xs text-accent underline"
                    >
                        Download PDF
                    </a>
                </div>
            </object>
        );
    } else if (docxPath) {
        return (
            <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docxPath)}`}
                title="Word Document Viewer"
                className="mx-auto aspect-[210/297] max-h-[80vh] w-full max-w-full rounded-lg border border-border bg-card shadow"
                style={{
                    border: 'none',
                    width: '210mm',
                    height: '297mm',
                }}
                allowFullScreen
            />
        );
    } else {
        return (
            <div className="w-full p-8 text-center text-muted-foreground">
                <div>No document available.</div>
            </div>
        );
    }
};

export default DocumentViewer;
