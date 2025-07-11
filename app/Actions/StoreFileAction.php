<?php

namespace App\Actions;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use App\Services\StorageService;

class StoreFileAction
{
    protected $storageService;

    public function __construct(StorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    /**
     * Store a file in the specified storage.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return string The file path
     * @throws Exception If the file cannot be stored
     */
    public function execute(UploadedFile $file, string $directory = 'uploads'): string
    {
        try {
            $userId = Auth::id();
            $yearMonth = date('Y/m');
            $originalName = $file->getClientOriginalName();
            $safeName = str_replace([' ', '/', '\\', '?', '%', '*', ':', '|', '"', '<', '>', '.'], '-', pathinfo($originalName, PATHINFO_FILENAME));
            $extension = $file->getClientOriginalExtension();

            $fileName = "{$safeName}.{$extension}";
            $path = $this->storageService->storeFile($file, "{$directory}/{$userId}/{$yearMonth}", $fileName);

            return $path;
        } catch (Exception $e) {
            throw new Exception('Failed to store file: ' . $e->getMessage(), 0, $e);
        }
    }
}
