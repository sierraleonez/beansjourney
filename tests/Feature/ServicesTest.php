<?php

namespace Tests\Feature;

use App\Models\Bean;
use App\Models\Comment;
use App\Models\Origin;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\Roastery;
use App\Models\User;
use App\Services\CommentService;
use App\Services\CreateBean;
use App\Services\CreateReview;
use App\Services\DeletePost;
use App\Services\ToggleVote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_bean_creates_roastery_and_attributes_bean(): void
    {
        $user = User::factory()->create();
        $origin = Origin::factory()->create(['name' => 'Ethiopia']);

        $bean = app(CreateBean::class)->create($user, 'Monogram Coffee', [
            'name' => 'Ethiopia Bishan Beke',
            'origin_id' => $origin->id,
        ]);

        $this->assertInstanceOf(Bean::class, $bean);
        $this->assertSame('Monogram Coffee', $bean->roastery->name);
        $this->assertSame('Ethiopia', $bean->origin->name);
        $this->assertSame($user->id, $bean->created_by);
        $this->assertSame(1, Roastery::count());
    }

    public function test_create_bean_reuses_existing_roastery_by_name(): void
    {
        $user = User::factory()->create();
        $roastery = Roastery::factory()->create(['name' => 'Monogram Coffee']);

        app(CreateBean::class)->create($user, 'Monogram Coffee', ['name' => 'Another Bean']);

        $this->assertSame(1, Roastery::count());
        $this->assertSame($roastery->id, Bean::first()->roastery_id);
    }

    public function test_create_bean_passes_location_and_social_to_new_roastery(): void
    {
        $user = User::factory()->create();

        $bean = app(CreateBean::class)->create($user, 'Sweet Bloom Coffee', [
            'name' => 'Ethiopia Bishan Beke',
        ], [
            'location' => 'Denver, USA',
            'social' => ['instagram' => '@sweetbloomcoffee', 'website' => 'https://sweetbloomcoffee.com'],
        ]);

        $this->assertSame('Denver, USA', $bean->roastery->location);
        $this->assertSame([
            'instagram' => '@sweetbloomcoffee',
            'website' => 'https://sweetbloomcoffee.com',
        ], $bean->roastery->social);
    }

    public function test_create_bean_does_not_overwrite_existing_roastery_location_and_social(): void
    {
        $user = User::factory()->create();
        $roastery = Roastery::factory()->create([
            'name' => 'Monogram Coffee',
            'location' => 'Chicago, USA',
            'social' => ['instagram' => '@monogramcoffee'],
        ]);

        app(CreateBean::class)->create($user, 'Monogram Coffee', ['name' => 'Another Bean'], [
            'location' => null,
            'social' => null,
        ]);

        $roastery->refresh();
        $this->assertSame('Chicago, USA', $roastery->location);
        $this->assertSame(['instagram' => '@monogramcoffee'], $roastery->social);
    }

    public function test_create_bean_reuses_and_restores_trashed_roastery(): void
    {
        $user = User::factory()->create();
        $roastery = Roastery::factory()->create(['name' => 'Monogram Coffee']);
        $roastery->delete();

        app(CreateBean::class)->create($user, 'Monogram Coffee', ['name' => 'Another Bean']);

        $this->assertSame(1, Roastery::count());
        $this->assertNotSoftDeleted($roastery);
        $this->assertSame($roastery->id, Bean::first()->roastery_id);
    }

    public function test_toggle_vote_toggles_and_returns_state(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();

        $service = app(ToggleVote::class);
        $on = $service->toggle($user, $review);
        $off = $service->toggle($user, $review);

        $this->assertTrue($on['voted']);
        $this->assertSame(1, $on['count']);
        $this->assertFalse($off['voted']);
        $this->assertSame(0, $off['count']);
        $this->assertDatabaseCount('votes', 0);
    }

    public function test_votes_are_unique_per_user_per_votable(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();

        $service = app(ToggleVote::class);
        $service->toggle($user, $review);

        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);
        $review->votes()->create(['user_id' => $user->id]);
    }

    public function test_author_can_soft_delete_own_review(): void
    {
        $author = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $author->id]);

        app(DeletePost::class)->delete($author, $review);

        $this->assertSoftDeleted($review);
    }

    public function test_admin_delete_writes_activity_log(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $review = Review::factory()->create();

        app(DeletePost::class)->delete($admin, $review, 'admin');

        $this->assertSoftDeleted($review);
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'action' => 'deleted',
            'subject_type' => Review::class,
            'subject_id' => $review->id,
        ]);
    }

    public function test_comment_service_stores_reply_with_parent(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();
        $root = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
        ]);

        $reply = app(CommentService::class)->store($user, $review, 'Great question!', $root);

        $this->assertSame($root->id, $reply->parent_id);
        $this->assertSame(Review::class, $reply->commentable_type);
        $this->assertSame($review->id, $reply->commentable_id);
    }

    public function test_deleted_comment_keeps_replies_attached(): void
    {
        $author = User::factory()->create();
        $review = Review::factory()->create();
        $root = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
        ]);
        $reply = Comment::factory()->create([
            'commentable_type' => Review::class,
            'commentable_id' => $review->id,
            'parent_id' => $root->id,
        ]);

        app(CommentService::class)->softDelete($author, $root);

        $this->assertSoftDeleted($root);
        $this->assertNotSoftDeleted($reply);
        $this->assertSame(2, Comment::withTrashed()->count());
    }

    public function test_create_review_records_activity(): void
    {
        $user = User::factory()->create();
        $bean = Bean::factory()->create();

        app(CreateReview::class)->create($user, $bean, 5, 'Outstanding cup, bright and clean.');

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'action' => 'created',
            'subject_type' => Review::class,
        ]);
    }
}
