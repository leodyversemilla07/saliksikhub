<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReviewerAssignment extends Model
{
    use HasFactory;

    const STATUS_INVITED = 'invited';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';
    const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'manuscript_id',
        'reviewer_id',
        'status',
        'invited_at',
        'response_at',
        'due_date'
    ];

    protected $casts = [
        'invited_at' => 'datetime',
        'response_at' => 'datetime',
        'due_date' => 'datetime'
    ];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class, 'assignment_id');
    }

    public function accept()
    {
        $this->update([
            'status' => self::STATUS_ACCEPTED,
            'response_at' => now()
        ]);
    }

    public function decline()
    {
        $this->update([
            'status' => self::STATUS_DECLINED,
            'response_at' => now()
        ]);
    }

    public function complete()
    {
        $this->update(['status' => self::STATUS_COMPLETED]);
    }

    public function isPending()
    {
        return $this->status === self::STATUS_INVITED;
    }

    public function isAccepted()
    {
        return $this->status === self::STATUS_ACCEPTED;
    }

    public function isOverdue()
    {
        return $this->due_date && now()->greaterThan($this->due_date);
    }
}
