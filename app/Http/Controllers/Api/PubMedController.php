<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use App\Services\Metadata\PubMedXMLGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PubMedController extends Controller
{
    protected PubMedXMLGenerator $pubmedGenerator;

    public function __construct(PubMedXMLGenerator $pubmedGenerator)
    {
        $this->pubmedGenerator = $pubmedGenerator;
    }

    /**
     * Get PubMed XML for a single publication
     */
    public function show(Publication $publication)
    {
        try {
            $xml = $this->pubmedGenerator->generate($publication);

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'inline; filename="pubmed-article-'.$publication->id.'.xml"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PubMed XML',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download PubMed XML for a publication
     */
    public function download(Publication $publication)
    {
        try {
            $xml = $this->pubmedGenerator->generate($publication);
            $filename = $this->pubmedGenerator->generateFilename($publication);

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PubMed XML',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Batch export PubMed XML for multiple publications
     */
    public function batch(Request $request)
    {
        $request->validate([
            'publication_ids' => 'required|array',
            'publication_ids.*' => 'exists:publications,id',
        ]);

        $publications = Publication::whereIn('id', $request->publication_ids)
            ->with(['manuscript.authors', 'manuscript.issue', 'doi'])
            ->get();

        try {
            // Generate batch XML (all articles in one XML file)
            $xml = $this->pubmedGenerator->generateBatch($publications->all());

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="pubmed-batch-'.date('Y-m-d').'.xml"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PubMed batch XML',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get PubMed XML for all publications in an issue
     */
    public function issue($issueId)
    {
        $publications = Publication::whereHas('manuscript', function ($query) use ($issueId) {
            $query->where('issue_id', $issueId);
        })
            ->where('status', 'published')
            ->with(['manuscript.authors', 'manuscript.issue', 'doi'])
            ->get();

        if ($publications->isEmpty()) {
            return response()->json([
                'error' => 'No published articles found in this issue',
            ], 404);
        }

        try {
            // Generate batch XML for all articles in the issue
            $xml = $this->pubmedGenerator->generateBatch($publications->all());

            $issue = $publications->first()->manuscript->issue;
            $filename = sprintf(
                'pubmed-issue-%s-%s.xml',
                $issue->volume_number ?? 'v1',
                $issue->issue_number ?? 'i1'
            );

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PubMed XML for issue',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate PubMed XML
     */
    public function validateXml(Request $request)
    {
        $request->validate([
            'xml' => 'required|string',
        ]);

        try {
            $isValid = $this->pubmedGenerator->validate($request->xml);

            return response()->json([
                'valid' => $isValid,
                'message' => $isValid ? 'PubMed XML is valid' : 'PubMed XML validation failed',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Prepare FTP upload package for PubMed Central
     *
     * This generates the XML and saves it to a designated FTP directory
     * for automated submission to PubMed Central
     */
    public function prepareFtpUpload(Request $request)
    {
        $request->validate([
            'publication_ids' => 'required|array',
            'publication_ids.*' => 'exists:publications,id',
        ]);

        $publications = Publication::whereIn('id', $request->publication_ids)
            ->with(['manuscript.authors', 'manuscript.issue', 'doi'])
            ->get();

        try {
            $xml = $this->pubmedGenerator->generateBatch($publications->all());

            // Save to FTP upload directory
            $ftpPath = 'pubmed-ftp/'.date('Y-m-d');
            $filename = 'pubmed-submission-'.date('YmdHis').'.xml';

            Storage::disk('local')->put($ftpPath.'/'.$filename, $xml);

            return response()->json([
                'success' => true,
                'message' => 'PubMed XML prepared for FTP upload',
                'filename' => $filename,
                'path' => $ftpPath.'/'.$filename,
                'articles_count' => $publications->count(),
                'file_size' => strlen($xml),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to prepare FTP upload',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get list of prepared FTP uploads
     */
    public function listFtpUploads()
    {
        $files = Storage::disk('local')->files('pubmed-ftp');

        $uploads = collect($files)->map(function ($file) {
            return [
                'filename' => basename($file),
                'path' => $file,
                'size' => Storage::disk('local')->size($file),
                'last_modified' => Storage::disk('local')->lastModified($file),
            ];
        })->sortByDesc('last_modified')->values();

        return response()->json([
            'uploads' => $uploads,
            'count' => $uploads->count(),
        ]);
    }
}
