<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class BeanPhoto extends Model
{
    protected $fillable = [
        'bean_id',
        'path',
    ];

    protected $appends = ['url'];

    public function bean(): BelongsTo
    {
        return $this->belongsTo(Bean::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }
}
