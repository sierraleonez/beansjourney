<?php

namespace Tests\Feature;

use App\Models\Bean;
use App\Models\Comment;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ThreadsTest extends TestCase
{
    use RefreshDatabase;

    public function test_bean_detail_shows_all_cap2_fields(): void
    {
        $bean = Bean::factory()->create([
            'name' => 'Ethiopia Bishan Beke',
            'process' => 'Natural',
            'origin' => 'Ethiopia',
            'variety' => 'Heirloom',
            'flavour_perception' => 'Blueberry, florals, bright acidity.',
            'roast_date' => '2026-07-01',
            'roast_profile' => 'Light',
            'purpose' => 'Filter',
            'purchased_on' => '2026-07-10',
            'altitude' => '1,900m',
        ]);

        $this->get("/beans/{$bean->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Beans/Show')
                ->where('bean.name', 'Ethiopia Bishan Beke')
                ->where('bean.process', 'Natural')
                ->where('bean.origin', 'Ethiopia')
                ->where('bean.variety', 'Heirloom')
                ->where('bean.flavour_perception', 'Blueberry, florals, bright acidity.')
                ->where('bean.roast_date', '2026-07-01T00:00:00.000000Z')
                ->where('bean.roast_profile', 'Light')
                ->where('bean.purpose', 'Filter')
                ->where('bean.purchased_on', '2026-07-10T00:00:00.000000Z')
                ->where('bean.altitude', '1,900m'));
    }

    public function test_deleted_comment_renders_as_deleted_with_replies(): void
    {
        $author = User::factory()->create();
        $review = Review::factory()->create();
        $root = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
            'body' => 'First!',
        ]);
        $reply = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
            'parent_id' => $root->id,
            'body' => 'Agreed.',
        ]);

        $root->delete();

        $this->get("/reviews/{$review->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reviews/Show')
                ->where('comment_count', 2)
                ->has('comments.roots', 1)
                ->where('comments.roots.0.deleted', true)
                ->whereNull('comments.roots.0.body')
                ->where('comments.roots.0.children.0.body', 'Agreed.'));
    }

    public function test_verified_user_can_reply_to_comment(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();
        $root = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
        ]);

        $this->actingAs($user)
            ->post('/comments', [
                'commentable_type' => 'review',
                'commentable_id' => $review->id,
                'parent_id' => $root->id,
                'body' => 'How fine do you grind?',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('comments', [
            'parent_id' => $root->id,
            'body' => 'How fine do you grind?',
        ]);
    }

    public function test_reply_parent_must_belong_to_same_thread(): void
    {
        $user = User::factory()->create();
        $reviewA = Review::factory()->create();
        $reviewB = Review::factory()->create();
        $foreignRoot = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $reviewB->id,
        ]);

        $this->actingAs($user)
            ->post('/comments', [
                'commentable_type' => 'review',
                'commentable_id' => $reviewA->id,
                'parent_id' => $foreignRoot->id,
                'body' => 'Out of thread reply',
            ])
            ->assertSessionHasErrors('parent_id');

        $this->assertDatabaseCount('comments', 1);
    }

    public function test_recipe_thread_sorts_by_most_upvoted(): void
    {
        $user = User::factory()->create();
        $bean = Bean::factory()->create();
        $low = Recipe::factory()->create(['bean_id' => $bean->id]);
        $high = Recipe::factory()->create(['bean_id' => $bean->id]);

        for ($i = 0; $i < 3; $i++) {
            $voter = User::factory()->create();
            $high->votes()->create(['user_id' => $voter->id]);
        }

        $this->get("/recipes/{$high->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Recipes/Show')
                ->where('recipe.votes_count', 3));
    }
}
