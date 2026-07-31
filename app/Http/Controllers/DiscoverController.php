<?php

namespace App\Http\Controllers;

use App\Models\Bean;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\Roastery;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscoverController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'newest');
        $sort = in_array($sort, ['newest', 'top', 'name'], true) ? $sort : 'newest';

        $query = Bean::query()
            ->with('roastery:id,name,location')
            ->withCount(['reviews', 'recipes'])
            ->withAvg('reviews as average_rating', 'rating');

        $query = match ($sort) {
            'top' => $query->orderByDesc('average_rating')->orderByDesc('reviews_count'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('created_at'),
        };

        return Inertia::render('Discover', [
            'beans' => $query->paginate(12),
            'sort' => $sort,
            'roasters' => Roastery::query()
                ->withCount('beans')
                ->orderByDesc('beans_count')
                ->limit(6)
                ->get(['id', 'name', 'location']),
            'stats' => [
                'beans' => Bean::count(),
                'reviews' => Review::count(),
                'recipes' => Recipe::count(),
                'users' => User::count(),
            ],
        ]);
    }
}
