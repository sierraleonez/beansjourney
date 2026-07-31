<?php

namespace Database\Factories;

use App\Models\Bean;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    protected $model = \App\Models\Recipe::class;

    public function definition(): array
    {
        return [
            'bean_id' => Bean::factory(),
            'user_id' => User::factory(),
            'brew_method' => fake()->randomElement(['americano', 'espresso', 'v60', 'french_press', 'aeropress', 'tubruk', 'other']),
            'tools' => fake()->optional()->randomElement([
                null,
                ['grinder' => 'Comandante C40', 'dripper' => 'Hario V60 02'],
            ]),
            'process' => fake()->paragraph(),
            'tasting_notes' => fake()->optional()->sentence(),
            'dose_ratio' => fake()->optional()->randomElement(['1:15', '1:16', '1:17']),
            'grind_size' => fake()->optional()->randomElement(['Medium-fine', 'Medium', 'Coarse']),
            'water_temp' => fake()->optional()->randomElement(['92°C', '94°C', '96°C']),
        ];
    }
}
