<?php

namespace Database\Factories;

use App\Models\Roastery;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Bean>
 */
class BeanFactory extends Factory
{
    protected $model = \App\Models\Bean::class;

    public function definition(): array
    {
        return [
            'roastery_id' => Roastery::factory(),
            'name' => fake()->unique()->words(3, true),
            'process' => fake()->randomElement(['Natural', 'Washed', 'Honey', null]),
            'origin' => fake()->optional()->country(),
            'variety' => fake()->optional()->randomElement(['Heirloom', 'Bourbon', 'Caturra', 'Gesha']),
            'flavour_perception' => fake()->optional()->sentence(),
            'roast_date' => fake()->optional()->date(),
            'roast_profile' => fake()->optional()->randomElement(['Light', 'Medium', 'Medium-Dark', 'Dark']),
            'purpose' => fake()->optional()->randomElement(['Espresso', 'Filter', 'Omni']),
            'purchased_on' => fake()->optional()->date(),
            'altitude' => fake()->optional()->randomElement(['1,200m', '1,600m', '2,000m']),
            'created_by' => User::factory(),
        ];
    }
}
