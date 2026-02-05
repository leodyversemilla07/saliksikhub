<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'galley_id',
        'metric_type',
        'session_id',
        'user_ip',
        'user_agent',
        'country_code',
        'region',
        'city',
        'institution_id',
        'metric_date',
        'metric_time',
        'referrer_url',
        'access_method',
        'platform',
    ];

    protected $casts = [
        'metric_date' => 'date',
        'metric_time' => 'datetime',
    ];

    /**
     * Get the manuscript this statistic belongs to.
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the galley (if this is a request metric).
     */
    public function galley(): BelongsTo
    {
        return $this->belongsTo(Galley::class);
    }

    /**
     * Get the institution (if applicable).
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Check if this is an investigation (abstract view).
     */
    public function isInvestigation(): bool
    {
        return $this->metric_type === 'investigation';
    }

    /**
     * Check if this is a request (full-text download).
     */
    public function isRequest(): bool
    {
        return $this->metric_type === 'request';
    }

    /**
     * Scope to get investigations.
     */
    public function scopeInvestigations($query)
    {
        return $query->where('metric_type', 'investigation');
    }

    /**
     * Scope to get requests.
     */
    public function scopeRequests($query)
    {
        return $query->where('metric_type', 'request');
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('metric_date', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by country.
     */
    public function scopeByCountry($query, string $countryCode)
    {
        return $query->where('country_code', $countryCode);
    }

    /**
     * Scope to get unique metrics (by session).
     */
    public function scopeUnique($query)
    {
        return $query->distinct('session_id');
    }

    /**
     * Record an investigation (abstract/landing page view).
     */
    public static function recordInvestigation(
        int $manuscriptId,
        string $sessionId,
        string $userIp = null,
        string $userAgent = null,
        string $countryCode = null,
        int $institutionId = null
    ): self {
        return self::create([
            'manuscript_id' => $manuscriptId,
            'metric_type' => 'investigation',
            'session_id' => $sessionId,
            'user_ip' => $userIp,
            'user_agent' => $userAgent,
            'country_code' => $countryCode,
            'institution_id' => $institutionId,
            'metric_date' => today(),
            'metric_time' => now(),
            'access_method' => 'regular',
        ]);
    }

    /**
     * Record a request (full-text download).
     */
    public static function recordRequest(
        int $manuscriptId,
        int $galleyId,
        string $sessionId,
        string $userIp = null,
        string $userAgent = null,
        string $countryCode = null,
        int $institutionId = null
    ): self {
        return self::create([
            'manuscript_id' => $manuscriptId,
            'galley_id' => $galleyId,
            'metric_type' => 'request',
            'session_id' => $sessionId,
            'user_ip' => $userIp,
            'user_agent' => $userAgent,
            'country_code' => $countryCode,
            'institution_id' => $institutionId,
            'metric_date' => today(),
            'metric_time' => now(),
            'access_method' => 'regular',
        ]);
    }
}
