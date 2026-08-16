<?php

namespace Tests\Feature;

use App\Models\Bean;
use App\Models\Roastery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoasteryDedupTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_bean_reuses_an_existing_roastery_regardless_of_case(): void
    {
        $roastery = Roastery::factory()->create(['name' => 'Blue Bottle Coffee']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/beans', [
                'roastery_name' => '  blue bottle coffee  ',
                'name' => 'Ethiopia Bishan Beke',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('roasteries', 1);
        $this->assertSame($roastery->id, Bean::firstOrFail()->roastery_id);
    }

    public function test_creating_a_bean_with_a_new_roastery_name_creates_it(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/beans', [
                'roastery_name' => 'Sweet Bloom Coffee Roasters',
                'name' => 'Ethiopia Bishan Beke',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('roasteries', 1);
        $this->assertDatabaseHas('roasteries', ['name' => 'Sweet Bloom Coffee Roasters']);
    }
}
