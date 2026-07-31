<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
{
    protected $model = \App\Models\Vote::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'votable_type' => Review::class,
            'votable_id' => Review::factory(),
        ];
    }
}
