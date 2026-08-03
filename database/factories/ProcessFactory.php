<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Process>
 */
class ProcessFactory extends Factory
{
    protected $model = \App\Models\Process::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
        ];
    }
}
