<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['article_id', 'reviewer_id', 'feedback'];

    public function article()
    {
        return $this->belongsTo(Article::class); // Each review belongs to one article
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id'); // Each review is written by one user (the reviewer)
    }
}
