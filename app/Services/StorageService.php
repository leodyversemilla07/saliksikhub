<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StorageService
{
    /**
     * Generate a temporary URL for a file.
     *
     * @param string $filePath
     * @param int $expirationMinutes
     * @return string|null
     */
    public function generateTemporaryUrl(string $filePath, int $expirationMinutes = 5): ?string
    {
        try {
            return Storage::disk('spaces')->temporaryUrl($filePath, now()->addMinutes($expirationMinutes));
        } catch (Exception $e) {
            logger()->error('Temporary URL Generation Error', [
                'error_message' => $e->getMessage(),
                'file_path' => $filePath,
            ]);

            return null;
        }
    }

    /**
     * Store a file in the specified storage.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string|null $fileName
     * @return string The file path
     * @throws Exception If the file cannot be stored
     */
    public function storeFile(UploadedFile $file, string $directory, ?string $fileName = null): string
    {
        try {
            $fileName = $fileName ?? $file->getClientOriginalName();

            return Storage::disk('spaces')->putFileAs($directory, $file, $fileName);
        } catch (Exception $e) {
            throw new Exception('Failed to store file: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Check if a file exists in the storage.
     *
     * @param string $filePath
     * @return bool
     */
    public function fileExists(string $filePath): bool
    {
        return Storage::disk('spaces')->exists($filePath);
    }

    /**
     * Retrieve the content of a file from storage.
     *
     * @param string $filePath
     * @return string
     * @throws Exception If the file cannot be retrieved
     */
    public function getFileContent(string $filePath): string
    {
        try {
            return Storage::disk('spaces')->get($filePath);
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve file content: ' . $e->getMessage(), 0, $e);
        }
    }
}
