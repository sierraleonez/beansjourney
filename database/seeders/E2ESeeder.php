<?php

namespace Database\Seeders;

use App\Models\Bean;
use App\Models\Roastery;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Minimal, deterministic fixture set for the Playwright e2e smoke suite.
 * Kept separate from DatabaseSeeder so e2e runs stay fast and don't depend
 * on random factory data (bean/roastery ids need to be predictable).
 */
class E2ESeeder extends Seeder
{
    public function run(): void
    {
        DatabaseSeeder::seedMasterData();

        User::factory()->create([
            'name' => 'E2E Tester',
            'email' => 'e2e@beansjourney.test',
        ]);

        $roastery = Roastery::factory()->create([
            'name' => 'E2E Seed Roastery',
        ]);

        Bean::factory()->create([
            'roastery_id' => $roastery->id,
            'name' => 'E2E Seed Bean',
        ]);
    }
}
