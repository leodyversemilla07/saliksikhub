<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class JournalPlugin extends Pivot
{
    protected $table = 'journal_plugins';

    protected $fillable = [
        'journal_id',
        'plugin_id',
        'enabled',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'enabled' => 'boolean',
    ];
}
