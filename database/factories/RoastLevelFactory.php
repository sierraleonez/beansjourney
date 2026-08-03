<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\RoastLevel>
 */
class RoastLevelFactory extends Factory
{
    protected $model = \App\Models\RoastLevel::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
        ];
    }
}
