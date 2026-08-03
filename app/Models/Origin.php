<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Origin extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function beans(): HasMany
    {
        return $this->hasMany(Bean::class);
    }
}
