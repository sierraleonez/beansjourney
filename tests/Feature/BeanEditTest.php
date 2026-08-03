<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\BeanPhoto;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BeanEditTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_bean_stores_multiple_photos(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/beans', [
                'roastery_name' => 'Monogram Coffee',
                'name' => 'Ethiopia Bishan Beke',
                'photos' => [
                    UploadedFile::fake()->image('one.jpg'),
                    UploadedFile::fake()->image('two.jpg'),
                    UploadedFile::fake()->image('three.jpg'),
                ],
            ])
            ->assertRedirect();

        $bean = Bean::firstOrFail();

        $this->assertSame(3, $bean->photos()->count());
        $this->assertNotNull($bean->photo_url);
        $this->assertCount(3, $bean->photo_urls);

        foreach ($bean->photos as $photo) {
            Storage::disk('public')->assertExists($photo->path);
        }
    }

    public function test_more_than_five_photos_are_rejected_on_create(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/beans', [
                'roastery_name' => 'Monogram Coffee',
                'name' => 'Ethiopia Bishan Beke',
                'photos' => array_map(
                    fn ($i) => UploadedFile::fake()->image("photo-{$i}.jpg"),
                    range(1, 6),
                ),
            ])
            ->assertSessionHasErrors('photos');

        $this->assertDatabaseCount('beans', 0);
    }

    public function test_creator_can_edit_own_bean_and_remove_a_photo(): void
    {
        Storage::fake('public');

        $creator = User::factory()->create();
        $bean = Bean::factory()->create(['created_by' => $creator->id, 'name' => 'Original Name']);
        $keptPhoto = $bean->photos()->create(['path' => 'beans/keep.jpg']);
        $removedPhoto = $bean->photos()->create(['path' => 'beans/remove.jpg']);
        Storage::disk('public')->put($removedPhoto->path, 'fake-contents');

        $this->assertTrue($creator->can('update', $bean));

        $this->actingAs($creator)
            ->from(route('beans.edit', $bean))
            ->patch(route('beans.update', $bean), [
                'name' => 'Updated Name',
                'remove_photo_ids' => [$removedPhoto->id],
            ])
            ->assertRedirect(route('beans.show', $bean));

        $bean->refresh();

        $this->assertSame('Updated Name', $bean->name);
        $this->assertDatabaseMissing('bean_photos', ['id' => $removedPhoto->id]);
        $this->assertDatabaseHas('bean_photos', ['id' => $keptPhoto->id]);
        Storage::disk('public')->assertMissing($removedPhoto->path);
    }

    public function test_non_creator_cannot_edit_bean(): void
    {
        $creator = User::factory()->create();
        $intruder = User::factory()->create();
        $bean = Bean::factory()->create(['created_by' => $creator->id]);

        $this->assertFalse($intruder->can('update', $bean));

        $this->actingAs($intruder)
            ->get(route('beans.edit', $bean))
            ->assertForbidden();

        $this->actingAs($intruder)
            ->patch(route('beans.update', $bean), ['name' => 'Hijacked'])
            ->assertForbidden();
    }

    public function test_admin_can_edit_any_bean(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $bean = Bean::factory()->create();

        $this->assertTrue($admin->can('update', $bean));

        $this->actingAs($admin)
            ->patch(route('beans.update', $bean), ['name' => 'Renamed By Admin'])
            ->assertRedirect(route('beans.show', $bean));

        $this->assertSame('Renamed By Admin', $bean->fresh()->name);
    }

    public function test_updating_a_bean_records_activity_log_with_field_diff(): void
    {
        $creator = User::factory()->create();
        $bean = Bean::factory()->create(['created_by' => $creator->id, 'name' => 'Before Name']);

        $this->actingAs($creator)
            ->patch(route('beans.update', $bean), [
                'name' => 'After Name',
            ])
            ->assertRedirect(route('beans.show', $bean));

        $log = ActivityLog::where('subject_type', Bean::class)
            ->where('subject_id', $bean->id)
            ->where('action', 'updated')
            ->firstOrFail();

        $this->assertSame($creator->id, $log->user_id);
        $this->assertArrayHasKey('changes', $log->meta);
        $this->assertArrayHasKey('name', $log->meta['changes']);
        $this->assertSame('Before Name', $log->meta['changes']['name']['from']);
        $this->assertSame('After Name', $log->meta['changes']['name']['to']);
    }

    public function test_bean_overview_returns_at_most_five_top_reviews_and_recipes(): void
    {
        $bean = Bean::factory()->create();

        Review::factory()->count(7)->create(['bean_id' => $bean->id]);
        Recipe::factory()->count(7)->create(['bean_id' => $bean->id]);

        $response = $this->get(route('beans.show', $bean));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('topReviews', 5)
            ->has('topRecipes', 5)
        );
    }
}
