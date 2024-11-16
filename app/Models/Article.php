<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'author_id', 'status'];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id'); // Each article belongs to one user (the author)
    }

    public function reviews()
    {
        return $this->hasMany(Review::class); // Each article can have many reviews
    }
}
