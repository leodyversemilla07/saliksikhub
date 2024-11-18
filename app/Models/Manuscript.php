<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manuscript extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'authors',
        'abstract',
        'keywords',
        'manuscript_path',
        'user_id', // Add user_id to fillable
    ];

    // Define the relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
