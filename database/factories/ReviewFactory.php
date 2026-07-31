<?php

namespace Database\Factories;

use App\Models\Bean;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = \App\Models\Review::class;

    public function definition(): array
    {
        return [
            'bean_id' => Bean::factory(),
            'user_id' => User::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'body' => fake()->sentence(12),
            'brew_method' => fake()->optional()->randomElement(['v60', 'espresso', 'french_press', 'aeropress']),
        ];
    }
}
