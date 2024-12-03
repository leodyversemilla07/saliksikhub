<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReviewerAssignment extends Model
{
    use HasFactory;

    protected $fillable = ['manuscript_id', 'reviewer_id'];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
