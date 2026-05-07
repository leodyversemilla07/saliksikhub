<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OAI\OAIRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OAIController extends Controller
{
    protected OAIRepository $repository;

    public function __construct(OAIRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * OAI-PMH endpoint handler
     */
    public function index(Request $request)
    {
        $verb = $request->input('verb');

        if (! $verb) {
            return $this->errorResponse('badVerb', 'Missing verb argument');
        }

        try {
            $response = match ($verb) {
                'Identify' => $this->identify($request),
                'ListMetadataFormats' => $this->listMetadataFormats($request),
                'ListSets' => $this->listSets($request),
                'ListIdentifiers' => $this->listIdentifiers($request),
                'ListRecords' => $this->listRecords($request),
                'GetRecord' => $this->getRecord($request),
                default => $this->errorResponse('badVerb', 'Illegal verb'),
            };

            return $this->xmlResponse($verb, $response);
        } catch (\Exception $e) {
            return $this->errorResponse('badArgument', $e->getMessage());
        }
    }

    /**
     * Identify verb
     */
    protected function identify(Request $request): array
    {
        return $this->repository->identify();
    }

    /**
     * ListMetadataFormats verb
     */
    protected function listMetadataFormats(Request $request): array
    {
        $identifier = $request->input('identifier');

        return ['formats' => $this->repository->listMetadataFormats($identifier)];
    }

    /**
     * ListSets verb
     */
    protected function listSets(Request $request): array
    {
        return ['sets' => $this->repository->listSets()];
    }

    /**
     * ListIdentifiers verb
     */
    protected function listIdentifiers(Request $request): array
    {
        $metadataPrefix = $request->input('metadataPrefix');

        if (! $metadataPrefix) {
            throw new \Exception('Missing required argument: metadataPrefix');
        }

        return $this->repository->listIdentifiers(
            $metadataPrefix,
            $request->input('from'),
            $request->input('until'),
            $request->input('set'),
            $request->input('resumptionToken')
        );
    }

    /**
     * ListRecords verb
     */
    protected function listRecords(Request $request): array
    {
        $metadataPrefix = $request->input('metadataPrefix');

        if (! $metadataPrefix) {
            throw new \Exception('Missing required argument: metadataPrefix');
        }

        return $this->repository->listRecords(
            $metadataPrefix,
            $request->input('from'),
            $request->input('until'),
            $request->input('set'),
            $request->input('resumptionToken')
        );
    }

    /**
     * GetRecord verb
     */
    protected function getRecord(Request $request): array
    {
        $identifier = $request->input('identifier');
        $metadataPrefix = $request->input('metadataPrefix');

        if (! $identifier || ! $metadataPrefix) {
            throw new \Exception('Missing required arguments: identifier and metadataPrefix');
        }

        return $this->repository->getRecord($identifier, $metadataPrefix);
    }

    /**
     * Generate XML response
     */
    protected function xmlResponse(string $verb, array $data)
    {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><OAI-PMH></OAI-PMH>');
        $xml->addAttribute('xmlns', 'http://www.openarchives.org/OAI/2.0/');
        $xml->addAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        $xml->addAttribute('xsi:schemaLocation', 'http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd');

        $xml->addChild('responseDate', gmdate('Y-m-d\TH:i:s\Z'));

        $requestNode = $xml->addChild('request', config('oai.base_url'));
        $requestNode->addAttribute('verb', $verb);

        $verbNode = $xml->addChild($verb);
        $this->arrayToXml($data, $verbNode);

        return response($xml->asXML(), 200)
            ->header('Content-Type', 'text/xml; charset=utf-8');
    }

    /**
     * Generate error response
     */
    protected function errorResponse(string $code, string $message)
    {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><OAI-PMH></OAI-PMH>');
        $xml->addAttribute('xmlns', 'http://www.openarchives.org/OAI/2.0/');

        $xml->addChild('responseDate', gmdate('Y-m-d\TH:i:s\Z'));
        $xml->addChild('request', config('oai.base_url'));

        $error = $xml->addChild('error', htmlspecialchars($message));
        $error->addAttribute('code', $code);

        return response($xml->asXML(), 200)
            ->header('Content-Type', 'text/xml; charset=utf-8');
    }

    /**
     * Convert array to XML recursively
     */
    protected function arrayToXml(array $data, \SimpleXMLElement $xml): void
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if (is_numeric($key)) {
                    // Handle numeric keys (arrays of items)
                    foreach ($value as $item) {
                        if (is_array($item)) {
                            $child = $xml->addChild(rtrim($xml->getName(), 's')); // Singular form
                            $this->arrayToXml($item, $child);
                        } else {
                            $xml->addChild(rtrim($xml->getName(), 's'), htmlspecialchars($item));
                        }
                    }
                } else {
                    // Handle associative arrays
                    if ($this->isSequentialArray($value)) {
                        foreach ($value as $item) {
                            $xml->addChild($key, htmlspecialchars($item));
                        }
                    } else {
                        $child = $xml->addChild($key);
                        $this->arrayToXml($value, $child);
                    }
                }
            } else {
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }

    /**
     * Check if array is sequential
     */
    protected function isSequentialArray(array $arr): bool
    {
        return array_keys($arr) === range(0, count($arr) - 1);
    }
}
