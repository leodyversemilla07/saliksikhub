<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiReview extends Model
{
    protected $fillable = ['manuscript_id', 'summary', 'keywords', 'language_quality'];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class, 'manuscript_id', 'id');
    }
}
