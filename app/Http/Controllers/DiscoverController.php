<?php

namespace App\Http\Controllers;

use App\Models\Bean;
use App\Models\Roastery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscoverController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'newest');
        $sort = in_array($sort, ['newest', 'top', 'name'], true) ? $sort : 'newest';
        $search = trim((string) $request->query('q', ''));

        $query = Bean::query()
            ->with('photos', 'roastery:id,name,location', 'process:id,name', 'origin:id,name', 'roastLevel:id,name')
            ->withCount(['reviews', 'recipes'])
            ->withAvg('reviews as average_rating', 'rating')
            ->when($search !== '', fn ($q) => $q->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('variety', 'like', "%{$search}%")
                    ->orWhereHas('origin', fn ($r) => $r->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('roastery', fn ($r) => $r->where('name', 'like', "%{$search}%"));
            }));

        $query = match ($sort) {
            'top' => $query->orderByDesc('average_rating')->orderByDesc('reviews_count'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('created_at'),
        };

        return Inertia::render('Discover', [
            'beans' => $query->paginate(12)->withQueryString(),
            'sort' => $sort,
            'search' => $search,
            'roasters' => Roastery::query()
                ->withCount('beans')
                ->orderByDesc('beans_count')
                ->limit(6)
                ->get(['id', 'name', 'location']),
        ]);
    }
}
