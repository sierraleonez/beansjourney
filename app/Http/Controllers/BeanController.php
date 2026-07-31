<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBeanRequest;
use App\Models\Bean;
use App\Services\CreateBean;
use App\Support\PostPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $bean->load('roastery:id,name,location,contact', 'creator:id,name');

        $payload = [
            'bean' => $bean,
            'tab' => $tab,
            'canWrite' => $request->user()?->hasVerifiedEmail() ?? false,
        ];

        if ($tab === 'reviews') {
            $payload['reviews'] = $this->reviews($bean, $request, $viewerId);
        } elseif ($tab === 'recipes') {
            $payload['recipes'] = $this->recipes($bean, $request, $viewerId);
        }

        return Inertia::render('Beans/Show', $payload);
    }

    public function create(): Response
    {
        return Inertia::render('Beans/Create');
    }

    public function store(StoreBeanRequest $request): RedirectResponse
    {
        $this->authorize('create', Bean::class);

        $bean = app(CreateBean::class)->create(
            $request->user(),
            $request->string('roastery_name')->toString(),
            $request->safe()->except('roastery_name'),
        );

        return redirect()->route('beans.show', $bean)->with('flash', [
            'type' => 'success',
            'message' => 'Bean added to the catalog.',
        ]);
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
}
