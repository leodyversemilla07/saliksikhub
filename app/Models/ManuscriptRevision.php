<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptRevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'version',
        'previous_status',
        'manuscript_path',
        'submitted_at',
        'comments',
        'user_id',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }
}
