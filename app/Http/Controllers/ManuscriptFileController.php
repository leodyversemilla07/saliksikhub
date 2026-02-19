<?php

namespace App\Http\Controllers;

use App\FileType;
use App\Models\Manuscript;
use App\Models\ManuscriptFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManuscriptFileController extends Controller
{
    /**
     * Upload a file for a manuscript.
     */
    public function upload(Request $request, Manuscript $manuscript)
    {
        // Authorize - ensure user owns the manuscript or is an editor
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'file' => 'required|file|max:102400', // 100MB max
            'file_type' => 'required|in:main_document,cover_letter,figure,table,supplementary',
        ]);

        $fileType = FileType::from($validated['file_type']);
        $uploadedFile = $request->file('file');

        // Validate MIME type
        $acceptedMimeTypes = $fileType->acceptedMimeTypes();
        if (! in_array('*/*', $acceptedMimeTypes) && ! in_array($uploadedFile->getMimeType(), $acceptedMimeTypes)) {
            return back()->with('error', 'Invalid file type for '.$fileType->label().'. Accepted types: '.implode(', ', $acceptedMimeTypes));
        }

        // Validate file size
        if ($uploadedFile->getSize() > $fileType->maxFileSize()) {
            $maxSizeMB = round($fileType->maxFileSize() / 1048576, 2);

            return back()->with('error', 'File too large. Maximum size for '.$fileType->label().' is '.$maxSizeMB.'MB.');
        }

        try {
            // Generate unique filename
            $originalName = $uploadedFile->getClientOriginalName();
            $extension = $uploadedFile->getClientOriginalExtension();
            $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)).'_'.time().'.'.$extension;

            // Store file
            $path = $uploadedFile->storeAs(
                'manuscripts/'.$manuscript->id.'/'.$fileType->value,
                $filename,
                'manuscripts'
            );

            // Get current version for this file type
            $currentVersion = ManuscriptFile::where('manuscript_id', $manuscript->id)
                ->where('file_type', $fileType)
                ->max('version') ?? 0;

            // Create file record
            $file = ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_type' => $fileType,
                'filename' => $originalName,
                'storage_path' => $path,
                'file_size' => $uploadedFile->getSize(),
                'mime_type' => $uploadedFile->getMimeType(),
                'uploaded_by' => Auth::id(),
                'version' => $currentVersion + 1,
            ]);

            return back()->with('success', $fileType->label().' uploaded successfully.');
        } catch (\Exception $e) {
            Log::error('File upload failed: '.$e->getMessage());

            return back()->with('error', 'Failed to upload file. Please try again.');
        }
    }

    /**
     * Download a manuscript file.
     */
    public function download(ManuscriptFile $file)
    {
        // Authorize - check if user has access to the manuscript
        $manuscript = $file->manuscript;

        // Allow if: owner, co-author, editor, or reviewer
        $user = Auth::user();
        $hasAccess = $manuscript->user_id === $user->id ||
                     $manuscript->editor_id === $user->id ||
                     $manuscript->coAuthors->contains($user->id) ||
                     $user->isEditor() ||
                     $user->reviews()->where('manuscript_id', $manuscript->id)->exists();

        if (! $hasAccess) {
            abort(403, 'Unauthorized access to this file.');
        }

        if (! Storage::disk('manuscripts')->exists($file->storage_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('manuscripts')->download($file->storage_path, $file->filename);
    }

    /**
     * Delete a manuscript file.
     */
    public function destroy(ManuscriptFile $file)
    {
        // Authorize - ensure user owns the manuscript
        $this->authorize('update', $file->manuscript);

        try {
            // Delete physical file
            $file->deleteFile();

            // Delete database record
            $file->delete();

            return back()->with('success', 'File deleted successfully.');
        } catch (\Exception $e) {
            Log::error('File deletion failed: '.$e->getMessage());

            return back()->with('error', 'Failed to delete file.');
        }
    }

    /**
     * Get all files for a manuscript.
     */
    public function index(Manuscript $manuscript)
    {
        // Authorize
        $this->authorize('view', $manuscript);

        $files = $manuscript->files()
            ->with('uploader')
            ->latest()
            ->get()
            ->map(function ($file) {
                return [
                    'id' => $file->id,
                    'filename' => $file->filename,
                    'file_type' => $file->file_type->value,
                    'file_type_label' => $file->file_type->label(),
                    'file_type_color' => $file->file_type->color(),
                    'file_size' => $file->getFormattedFileSize(),
                    'mime_type' => $file->mime_type,
                    'version' => $file->version,
                    'uploaded_at' => $file->created_at->toDateTimeString(),
                    'uploaded_by_name' => $file->uploader->firstname.' '.$file->uploader->lastname,
                    'download_url' => route('manuscripts.files.download', $file),
                ];
            })
            ->groupBy('file_type_label');

        return response()->json([
            'files' => $files,
        ]);
    }

    /**
     * Get file upload requirements for a file type.
     */
    public function requirements(Request $request)
    {
        $fileTypeValue = $request->input('file_type');

        if (! $fileTypeValue) {
            return response()->json(['error' => 'file_type parameter required'], 400);
        }

        try {
            $fileType = FileType::from($fileTypeValue);

            return response()->json([
                'file_type' => $fileType->value,
                'label' => $fileType->label(),
                'description' => $fileType->description(),
                'accepted_mime_types' => $fileType->acceptedMimeTypes(),
                'max_file_size' => $fileType->maxFileSize(),
                'max_file_size_mb' => round($fileType->maxFileSize() / 1048576, 2),
                'is_required' => $fileType->isRequired(),
            ]);
        } catch (\ValueError $e) {
            return response()->json(['error' => 'Invalid file type'], 400);
        }
    }
}
