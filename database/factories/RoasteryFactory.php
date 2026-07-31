<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Roastery>
 */
class RoasteryFactory extends Factory
{
    protected $model = \App\Models\Roastery::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company(),
            'contact' => fake()->optional()->email(),
            'social' => fake()->optional()->randomElement([
                null,
                ['instagram' => '@'.strtolower(fake()->company())],
            ]),
            'location' => fake()->optional()->city().', '.fake()->optional()->country(),
            'created_by' => User::factory(),
        ];
    }
}
