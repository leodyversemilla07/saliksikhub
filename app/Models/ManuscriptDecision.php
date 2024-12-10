<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManuscriptDecision extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'editor_id',
        'decision',
        'comments',
        'decided_at'
    ];

    protected $casts = [
        'decided_at' => 'datetime'
    ];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }
}
