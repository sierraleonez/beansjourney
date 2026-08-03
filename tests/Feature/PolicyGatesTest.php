<?php

namespace Tests\Feature;

use App\Models\Bean;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyGatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_bean(): void
    {
        $this->get('/beans/new')->assertRedirect('/login');
        $this->post('/beans', [
            'roastery_name' => 'Monogram',
            'name' => 'Some Bean',
        ])->assertRedirect('/login');
    }

    public function test_unverified_user_is_redirected_to_verification(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->post('/beans', [
                'roastery_name' => 'Monogram',
                'name' => 'Some Bean',
            ])
            ->assertRedirect('/verify-email');
    }

    public function test_unverified_user_cannot_post_review(): void
    {
        $user = User::factory()->unverified()->create();
        $bean = Bean::factory()->create();

        $this->actingAs($user)
            ->post("/beans/{$bean->id}/reviews", [
                'rating' => 5,
                'body' => 'An absolutely lovely cup of coffee.',
            ])
            ->assertRedirect('/verify-email');

        $this->assertDatabaseCount('reviews', 0);
    }

    public function test_verified_user_can_post_review(): void
    {
        $user = User::factory()->create();
        $bean = Bean::factory()->create();

        $this->actingAs($user)
            ->post("/beans/{$bean->id}/reviews", [
                'rating' => 5,
                'body' => 'An absolutely lovely cup of coffee.',
            ])
            ->assertRedirect(route('beans.show', ['bean' => $bean, 'tab' => 'reviews']));

        $this->assertDatabaseHas('reviews', [
            'bean_id' => $bean->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);
    }

    public function test_owner_can_soft_delete_own_review(): void
    {
        $owner = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($owner)
            ->delete("/reviews/{$review->id}")
            ->assertRedirect(route('beans.show', ['bean' => $review->bean_id, 'tab' => 'reviews']));

        $this->assertSoftDeleted($review);
    }

    public function test_owner_can_soft_delete_own_comment(): void
    {
        $owner = User::factory()->create();
        $review = Review::factory()->create();
        $comment = \App\Models\Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
            'user_id' => $owner->id,
        ]);

        $this->actingAs($owner)
            ->delete("/comments/{$comment->id}")
            ->assertRedirect();

        $this->assertSoftDeleted($comment);
    }

    public function test_vote_on_trashed_review_is_rejected(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();
        $review->delete();

        $this->actingAs($user)
            ->post('/votes', ['votable_type' => 'review', 'votable_id' => $review->id])
            ->assertNotFound();

        $this->assertDatabaseCount('votes', 0);
    }

    public function test_vote_on_trashed_comment_is_rejected(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();
        $comment = \App\Models\Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
        ]);
        $comment->delete();

        $this->actingAs($user)
            ->post('/votes', ['votable_type' => 'comment', 'votable_id' => $comment->id])
            ->assertNotFound();

        $this->assertDatabaseCount('votes', 0);
    }

    public function test_non_owner_cannot_delete_review(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->delete("/reviews/{$review->id}")
            ->assertForbidden();

        $this->assertNotSoftDeleted($review);
    }

    public function test_verified_user_can_toggle_vote_and_untoggle(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();

        $this->actingAs($user)
            ->post('/votes', ['votable_type' => 'review', 'votable_id' => $review->id])
            ->assertRedirect();

        $this->assertDatabaseCount('votes', 1);

        $this->actingAs($user)
            ->post('/votes', ['votable_type' => 'review', 'votable_id' => $review->id])
            ->assertRedirect();

        $this->assertDatabaseCount('votes', 0);
    }

    public function test_guest_vote_redirects_to_login(): void
    {
        $review = Review::factory()->create();

        $this->post('/votes', ['votable_type' => 'review', 'votable_id' => $review->id])
            ->assertRedirect('/login');

        $this->assertDatabaseCount('votes', 0);
    }

    public function test_only_admin_can_edit_bean(): void
    {
        $member = User::factory()->create();
        $bean = Bean::factory()->create();

        $this->assertFalse($member->can('update', $bean));

        $admin = User::factory()->create(['role' => 'admin']);
        $this->assertTrue($admin->can('update', $bean));
    }

    public function test_recipe_route_validation_rejects_unknown_brew_method(): void
    {
        $user = User::factory()->create();
        $bean = Bean::factory()->create();

        $this->actingAs($user)
            ->post("/beans/{$bean->id}/recipes", [
                'brew_method' => 'moka_pot',
            ])
            ->assertSessionHasErrors('brew_method');

        $this->assertDatabaseCount('recipes', 0);
    }

    public function test_verified_user_can_post_recipe(): void
    {
        $user = User::factory()->create();
        $bean = Bean::factory()->create();

        $this->actingAs($user)
            ->post("/beans/{$bean->id}/recipes", [
                'brew_method' => 'v60',
                'tools' => ['grinder' => 'Comandante', 'dripper' => 'V60 02'],
                'process' => 'Bloom 50g, then pour to 250g in 2:30.',
                'dose_ratio' => '1:16',
                'grind_size' => 'Sedang-Halus',
                'water_temp' => '94',
            ])
            ->assertRedirect(route('recipes.show', Recipe::first()));

        $this->assertDatabaseHas('recipes', [
            'bean_id' => $bean->id,
            'user_id' => $user->id,
            'brew_method' => 'v60',
        ]);
    }
}
