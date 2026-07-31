<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Recipe extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'bean_id',
        'user_id',
        'brew_method',
        'tools',
        'process',
        'tasting_notes',
        'dose_ratio',
        'grind_size',
        'water_temp',
    ];

    protected function casts(): array
    {
        return [
            'tools' => 'array',
        ];
    }

    public function bean(): BelongsTo
    {
        return $this->belongsTo(Bean::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }
}
