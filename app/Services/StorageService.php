<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StorageService
{
    /**
     * The storage disk instance.
     */
    private $storageDisk;

    /**
     * Constructor to set the disk name.
     */
    public function __construct(string $disk = 'local')
    {
        $this->storageDisk = Storage::disk($disk);
    }

    /**
     * Store a file with user and date-based directory structure, similar to StoreFileAction.
     */
    public function storeUserFile(UploadedFile $file, string $directory = 'uploads'): string
    {
        try {
            $userId = Auth::id();
            $yearMonth = date('Y/m');
            $originalName = $file->getClientOriginalName();
            $safeName = str_replace([' ', '/', '\\', '?', '%', '*', ':', '|', '"', '<', '>', '.'], '-', pathinfo($originalName, PATHINFO_FILENAME));
            $extension = $file->getClientOriginalExtension();

            $fileName = "{$safeName}.{$extension}";
            $path = $this->storeFile($file, "{$directory}/{$userId}/{$yearMonth}", $fileName);

            return $path;
        } catch (Exception $e) {
            throw new Exception('Failed to store file: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Generate a temporary URL for a file.
     */
    public function generateTemporaryUrl(string $filePath, int $expirationMinutes = 5): ?string
    {
        // Local disk does not support temporary URLs
        if (config('filesystems.default') === 'local') {
            logger()->warning('Temporary URL requested for local disk, which is not supported.', [
                'file_path' => $filePath,
            ]);

            return null;
        }
        try {
            return $this->storageDisk->temporaryUrl($filePath, now()->addMinutes($expirationMinutes));
        } catch (Exception $e) {
            logger()->error('Temporary URL Generation Error', [
                'error_message' => $e->getMessage(),
                'file_path' => $filePath,
            ]);

            return null;
        }
    }

    /**
     * Store a file in storage.
     */
    public function storeFile(UploadedFile $file, string $directory, ?string $fileName = null): string
    {
        try {
            $fileName = $fileName ?? $file->getClientOriginalName();

            return $this->storageDisk->putFileAs($directory, $file, $fileName);
        } catch (Exception $e) {
            throw new Exception('Failed to store file: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Check if a file exists in storage.
     */
    public function fileExists(string $filePath): bool
    {
        return $this->storageDisk->exists($filePath);
    }

    /**
     * Get the content of a file from storage.
     */
    public function getFileContent(string $filePath): string
    {
        try {
            return $this->storageDisk->get($filePath);
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve file content: '.$e->getMessage(), 0, $e);
        }
    }
}
