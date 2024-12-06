<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    // Define the fillable fields
    protected $fillable = [
        'title',
        'authors',
        'user_id',
        'abstract',
        'keywords',
        'status',
        'manuscript_path'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id'); // Each article belongs to one user (the author)
    }

    public function reviews()
    {
        return $this->hasMany(Review::class); // Each article can have many reviews
    }

    // public function comments()
    // {
    //     return $this->hasMany(Comment::class);
    // }
}
