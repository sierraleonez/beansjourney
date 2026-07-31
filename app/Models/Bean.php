<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bean extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'roastery_id',
        'name',
        'process',
        'origin',
        'variety',
        'flavour_perception',
        'roast_date',
        'roast_profile',
        'purpose',
        'purchased_on',
        'altitude',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'roast_date' => 'date',
            'purchased_on' => 'date',
        ];
    }

    public function roastery(): BelongsTo
    {
        return $this->belongsTo(Roastery::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }
}
