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
        'description',
        'process_id',
        'origin_id',
        'variety',
        'flavour_perception',
        'roast_date',
        'roast_level_id',
        'purpose_id',
        'purchased_on',
        'altitude',
        'created_by',
    ];

    protected $appends = ['photo_url', 'photo_urls'];

    protected function casts(): array
    {
        return [
            'roast_date' => 'date',
            'purchased_on' => 'date',
        ];
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photos->first()?->url;
    }

    public function getPhotoUrlsAttribute(): array
    {
        return $this->photos->pluck('url')->values()->all();
    }

    public function photos(): HasMany
    {
        return $this->hasMany(BeanPhoto::class)->orderBy('id');
    }

    public function roastery(): BelongsTo
    {
        return $this->belongsTo(Roastery::class);
    }

    public function process(): BelongsTo
    {
        return $this->belongsTo(Process::class);
    }

    public function origin(): BelongsTo
    {
        return $this->belongsTo(Origin::class);
    }

    public function roastLevel(): BelongsTo
    {
        return $this->belongsTo(RoastLevel::class);
    }

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(Purpose::class);
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
