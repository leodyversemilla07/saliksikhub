<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    const STATUS_PUBLISHED = 'Published';

    const STATUS_UNPUBLISHED = 'Unpublished';

    const STATUS_ARCHIVED = 'Archived';

    protected $fillable = [
        'title',
        'user_id',
        'authors',
        'status',
        'abstract',
        'keywords',
        'doi',
        'publication_date',
        'journal_name',
        'volume',
        'issue',
        'page_numbers',
        'pdf_file',
    ];

    protected $casts = [
        'publication_date' => 'datetime',
        'keywords' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }
}
