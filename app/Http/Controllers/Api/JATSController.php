<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use App\Services\Metadata\JATSXMLGenerator;
use Illuminate\Http\Request;

class JATSController extends Controller
{
    protected JATSXMLGenerator $jatsGenerator;

    public function __construct(JATSXMLGenerator $jatsGenerator)
    {
        $this->jatsGenerator = $jatsGenerator;
    }

    /**
     * Get JATS XML for a single publication
     */
    public function show(Publication $publication)
    {
        try {
            $xml = $this->jatsGenerator->generate($publication);

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'inline; filename="article-'.$publication->id.'.xml"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate JATS XML',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download JATS XML for a publication
     */
    public function download(Publication $publication)
    {
        try {
            $xml = $this->jatsGenerator->generate($publication);

            return response($xml, 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="article-'.$publication->id.'.xml"');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate JATS XML',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Batch export JATS XML for multiple publications
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

        $xmlFiles = [];

        foreach ($publications as $publication) {
            try {
                $xml = $this->jatsGenerator->generate($publication);
                $xmlFiles[] = [
                    'id' => $publication->id,
                    'title' => $publication->title,
                    'xml' => $xml,
                ];
            } catch (\Exception $e) {
                $xmlFiles[] = [
                    'id' => $publication->id,
                    'title' => $publication->title,
                    'error' => $e->getMessage(),
                ];
            }
        }

        // If single file, return XML directly
        if (count($xmlFiles) === 1 && ! isset($xmlFiles[0]['error'])) {
            return response($xmlFiles[0]['xml'], 200)
                ->header('Content-Type', 'application/xml; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="article-'.$xmlFiles[0]['id'].'.xml"');
        }

        // For multiple files, return JSON with all XMLs
        return response()->json([
            'count' => count($xmlFiles),
            'files' => $xmlFiles,
        ]);
    }

    /**
     * Validate JATS XML
     */
    public function validateXml(Request $request)
    {
        $request->validate([
            'xml' => 'required|string',
        ]);

        try {
            $isValid = $this->jatsGenerator->validate($request->xml);

            return response()->json([
                'valid' => $isValid,
                'message' => $isValid ? 'JATS XML is valid' : 'JATS XML validation failed',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get JATS XML for all publications in an issue
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

        $xmlFiles = [];

        foreach ($publications as $publication) {
            try {
                $xml = $this->jatsGenerator->generate($publication);
                $xmlFiles[] = [
                    'id' => $publication->id,
                    'title' => $publication->title,
                    'xml' => $xml,
                ];
            } catch (\Exception $e) {
                $xmlFiles[] = [
                    'id' => $publication->id,
                    'title' => $publication->title,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'issue_id' => $issueId,
            'count' => count($xmlFiles),
            'files' => $xmlFiles,
        ]);
    }
}
