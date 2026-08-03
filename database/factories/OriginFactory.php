<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Origin>
 */
class OriginFactory extends Factory
{
    protected $model = \App\Models\Origin::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
        ];
    }
}
