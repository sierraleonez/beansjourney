<?php

namespace Database\Seeders;

use App\Models\Bean;
use App\Models\Comment;
use App\Models\Origin;
use App\Models\Process;
use App\Models\Purpose;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\Roastery;
use App\Models\RoastLevel;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedMasterData();

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@beansjourney.test',
            'role' => 'admin',
        ]);

        $member = User::factory()->create([
            'name' => 'Dewi Lestari',
            'email' => 'dewi@beansjourney.test',
            'bio' => 'Light roast devotee. V60 obsessive.',
            'roast_level' => 'Light',
            'flavor_profile' => ['Fruity', 'Floral'],
        ]);

        $community = User::factory()->count(6)->create();

        $roasteries = Roastery::factory()->count(4)->create();

        $beans = collect();
        foreach ($roasteries as $roastery) {
            $beans = $beans->merge(Bean::factory()->count(3)->create([
                'roastery_id' => $roastery->id,
            ]));
        }

        $authors = $community->push($member)->push($admin);

        foreach ($beans as $bean) {
            $reviews = Review::factory()->count(fake()->numberBetween(1, 3))->create([
                'bean_id' => $bean->id,
                'user_id' => $authors->random()->id,
            ]);

            $recipes = Recipe::factory()->count(fake()->numberBetween(1, 2))->create([
                'bean_id' => $bean->id,
                'user_id' => $authors->random()->id,
            ]);

            foreach ($reviews->concat($recipes) as $post) {
                $root = Comment::factory()->create([
                    'user_id' => $authors->random()->id,
                    'commentable_type' => $post::class,
                    'commentable_id' => $post->id,
                ]);

                Comment::factory()->count(fake()->numberBetween(0, 2))->create([
                    'user_id' => $authors->random()->id,
                    'commentable_type' => $post::class,
                    'commentable_id' => $post->id,
                    'parent_id' => $root->id,
                ]);

                $voteCount = fake()->numberBetween(0, min(8, $authors->count()));
                foreach ($authors->random($voteCount) as $voter) {
                    Vote::factory()->create([
                        'user_id' => $voter->id,
                        'votable_type' => $post::class,
                        'votable_id' => $post->id,
                    ]);
                }
            }
        }
    }

    private function seedMasterData(): void
    {
        foreach (['Natural', 'Washed', 'Honey', 'Anaerobic', 'Giling Basah (Wet-Hulled)', 'Semi-Washed'] as $name) {
            Process::firstOrCreate(['name' => $name]);
        }

        foreach ([
            'Aceh Gayo', 'Sumatra Mandailing', 'Toraja', 'Flores Bajawa', 'Kintamani Bali',
            'Java Preanger', 'Wamena Papua', 'Ethiopia', 'Kenya', 'Kolombia', 'Brazil',
            'Guatemala', 'Kosta Rika', 'Yaman', 'Panama', 'Rwanda',
        ] as $name) {
            Origin::firstOrCreate(['name' => $name]);
        }

        foreach (['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'] as $name) {
            RoastLevel::firstOrCreate(['name' => $name]);
        }

        foreach (['Espresso', 'Filter', 'Omni'] as $name) {
            Purpose::firstOrCreate(['name' => $name]);
        }
    }
}
