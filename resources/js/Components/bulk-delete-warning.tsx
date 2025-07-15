import React from "react";

interface BulkDeleteWarningProps {
    selectedCount: number;
}

const BulkDeleteWarning: React.FC<BulkDeleteWarningProps> = ({ selectedCount }) => {
    const pluralize = (count: number, singular: string, plural: string) =>
        count === 1 ? singular : plural;

    return (
        <>
            <div
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mt-4"
                role="alert"
                aria-live="polite"
            >
                <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-lg">
                        {selectedCount} {pluralize(selectedCount, 'user', 'users')} selected
                    </span>
                    <div className="flex gap-2 mt-1">
                        <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            Bulk Action
                        </span>
                    </div>
                </div>
            </div>

            <div className="font-medium text-destructive my-4">Warning:</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-gray-600 dark:text-gray-400" aria-label="Deletion consequences">
                <li>User {pluralize(selectedCount, 'account', 'accounts')} and profile information</li>
                <li>All associated data and content</li>
                <li>User permissions and role assignments</li>
            </ul>
            <div className="font-medium text-destructive mt-3">This action cannot be undone.</div>
        </>
    );
};

export default BulkDeleteWarning;
