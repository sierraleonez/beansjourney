<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBeanRequest;
use App\Http\Requests\UpdateBeanRequest;
use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\Origin;
use App\Models\Process;
use App\Models\Purpose;
use App\Models\Roastery;
use App\Models\RoastLevel;
use App\Services\CreateBean;
use App\Services\UpdateBean;
use App\Support\PostPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BeanController extends Controller
{
    public function show(Request $request, Bean $bean): Response
    {
        $tab = in_array($request->query('tab'), ['overview', 'reviews', 'recipes'], true)
            ? $request->query('tab')
            : 'overview';

        $viewerId = $request->user()?->id;

        $bean->loadCount(['reviews', 'recipes']);
        $bean->loadAvg('reviews', 'rating');
        $bean->load(
            'photos',
            'roastery:id,name,location,contact',
            'creator:id,name',
            'process:id,name',
            'origin:id,name',
            'roastLevel:id,name',
            'purpose:id,name',
        );

        $payload = [
            'bean' => $bean,
            'tab' => $tab,
            'canWrite' => $request->user()?->hasVerifiedEmail() ?? false,
            'canEdit' => $request->user() ? $request->user()->can('update', $bean) : false,
        ];

        if ($tab === 'reviews') {
            $payload['reviews'] = $this->reviews($bean, $request, $viewerId);
        } elseif ($tab === 'recipes') {
            $payload['recipes'] = $this->recipes($bean, $request, $viewerId);
        } else {
            $payload['topReviews'] = $this->topReviews($bean, $viewerId);
            $payload['topRecipes'] = $this->topRecipes($bean, $viewerId);
            $payload['changeLog'] = ActivityLog::where('subject_type', (new Bean())->getMorphClass())
                ->where('subject_id', $bean->id)
                ->with('user:id,name')
                ->orderByDesc('created_at')
                ->limit(20)
                ->get();
        }

        return Inertia::render('Beans/Show', $payload);
    }

    public function create(): Response
    {
        return Inertia::render('Beans/Create', [
            'roasteries' => Roastery::query()->orderBy('name')->get(['id', 'name'])
                ->map(fn (Roastery $roastery) => ['value' => $roastery->name, 'label' => $roastery->name])
                ->values(),
            ...$this->masterDataOptions(),
        ]);
    }

    public function edit(Bean $bean): Response
    {
        $this->authorize('update', $bean);

        $bean->load('photos', 'process:id,name', 'origin:id,name', 'roastLevel:id,name', 'purpose:id,name');

        return Inertia::render('Beans/Edit', [
            'bean' => $bean,
            ...$this->masterDataOptions(),
        ]);
    }

    public function mine(Request $request): Response
    {
        $beans = Bean::query()
            ->where('created_by', $request->user()->id)
            ->with('photos', 'roastery:id,name,location', 'process:id,name', 'origin:id,name', 'roastLevel:id,name', 'purpose:id,name')
            ->withCount(['reviews', 'recipes'])
            ->withAvg('reviews as average_rating', 'rating')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Beans/Mine', [
            'beans' => $beans,
        ]);
    }

    public function store(StoreBeanRequest $request): RedirectResponse
    {
        $this->authorize('create', Bean::class);

        $data = $request->safe()->except([
            'roastery_name',
            'roastery_location',
            'roastery_instagram',
            'roastery_website',
            'photos',
        ]);

        $photoPaths = array_map(
            fn ($file) => $file->store('beans', 'public'),
            $request->file('photos', []),
        );

        $social = array_filter([
            'instagram' => $request->string('roastery_instagram')->toString() ?: null,
            'website' => $request->string('roastery_website')->toString() ?: null,
        ]);

        $bean = app(CreateBean::class)->create(
            $request->user(),
            $request->string('roastery_name')->toString(),
            $data,
            [
                'location' => $request->string('roastery_location')->toString() ?: null,
                'social' => $social === [] ? null : $social,
            ],
            $photoPaths,
        );

        return redirect()->route('beans.show', $bean)->with('flash', [
            'type' => 'success',
            'message' => 'Bean berhasil ditambahkan ke katalog.',
        ]);
    }

    public function update(UpdateBeanRequest $request, Bean $bean): RedirectResponse
    {
        $this->authorize('update', $bean);

        $removeIds = $request->input('remove_photo_ids', []);

        if ($removeIds !== []) {
            $bean->photos()
                ->whereIn('id', $removeIds)
                ->get()
                ->each(function ($photo) {
                    Storage::disk('public')->delete($photo->path);
                    $photo->delete();
                });
        }

        foreach ($request->file('photos', []) as $file) {
            $bean->photos()->create(['path' => $file->store('beans', 'public')]);
        }

        $data = $request->safe()->except(['photos', 'remove_photo_ids']);

        app(UpdateBean::class)->update($request->user(), $bean, $data);

        return redirect()->route('beans.show', $bean)->with('flash', [
            'type' => 'success',
            'message' => 'Bean berhasil diperbarui.',
        ]);
    }

    private function masterDataOptions(): array
    {
        return [
            'processes' => Process::query()->orderBy('name')->get(['id', 'name'])
                ->map(fn (Process $process) => ['value' => $process->id, 'label' => $process->name])
                ->values(),
            'origins' => Origin::query()->orderBy('name')->get(['id', 'name'])
                ->map(fn (Origin $origin) => ['value' => $origin->id, 'label' => $origin->name])
                ->values(),
            'roastLevels' => RoastLevel::query()->orderBy('id')->get(['id', 'name'])
                ->map(fn (RoastLevel $roastLevel) => ['value' => $roastLevel->id, 'label' => $roastLevel->name])
                ->values(),
            'purposes' => Purpose::query()->orderBy('name')->get(['id', 'name'])
                ->map(fn (Purpose $purpose) => ['value' => $purpose->id, 'label' => $purpose->name])
                ->values(),
        ];
    }

    private function reviews(Bean $bean, Request $request, ?int $viewerId): mixed
    {
        $sort = in_array($request->query('sort'), ['top', 'newest', 'highest'], true)
            ? $request->query('sort')
            : 'top';

        $query = $bean->reviews()
            ->with('user:id,name,bio')
            ->withCount(['votes', 'comments as comments_count' => fn ($q) => $q->withTrashed()])
            ->when($viewerId, fn ($q) => $q->withExists(['votes as voted_by_user' => fn ($v) => $v->where('user_id', $viewerId)]));

        $query = match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'highest' => $query->orderByDesc('rating')->orderByDesc('created_at'),
            default => $query->orderByDesc('votes_count'),
        };

        return $query->paginate(5)->through(fn ($r) => PostPresenter::review($r, $viewerId));
    }

    private function recipes(Bean $bean, Request $request, ?int $viewerId): mixed
    {
        $sort = in_array($request->query('sort'), ['most_upvoted', 'newest', 'most_discussed'], true)
            ? $request->query('sort')
            : 'most_upvoted';

        $query = $bean->recipes()
            ->with('user:id,name,bio')
            ->withCount(['votes', 'comments as comments_count' => fn ($q) => $q->withTrashed()])
            ->when($viewerId, fn ($q) => $q->withExists(['votes as voted_by_user' => fn ($v) => $v->where('user_id', $viewerId)]));

        $query = match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'most_discussed' => $query->orderByDesc('comments_count'),
            default => $query->orderByDesc('votes_count'),
        };

        return $query->paginate(5)->through(fn ($r) => PostPresenter::recipe($r, $viewerId));
    }

    private function topReviews(Bean $bean, ?int $viewerId): array
    {
        return $bean->reviews()
            ->with('user:id,name,bio')
            ->withCount(['votes', 'comments as comments_count' => fn ($q) => $q->withTrashed()])
            ->when($viewerId, fn ($q) => $q->withExists(['votes as voted_by_user' => fn ($v) => $v->where('user_id', $viewerId)]))
            ->orderByDesc('votes_count')
            ->limit(5)
            ->get()
            ->map(fn ($r) => PostPresenter::review($r, $viewerId))
            ->all();
    }

    private function topRecipes(Bean $bean, ?int $viewerId): array
    {
        return $bean->recipes()
            ->with('user:id,name,bio')
            ->withCount(['votes', 'comments as comments_count' => fn ($q) => $q->withTrashed()])
            ->when($viewerId, fn ($q) => $q->withExists(['votes as voted_by_user' => fn ($v) => $v->where('user_id', $viewerId)]))
            ->orderByDesc('votes_count')
            ->limit(5)
            ->get()
            ->map(fn ($r) => PostPresenter::recipe($r, $viewerId))
            ->all();
    }
}
