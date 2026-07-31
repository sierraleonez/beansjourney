<?php

namespace App\Http\Controllers;

use App\Models\Roastery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoasteryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Roasteries/Index', [
            'roasteries' => Roastery::query()
                ->withCount('beans')
                ->withMax('beans', 'created_at')
                ->orderBy('name')
                ->paginate(12),
        ]);
    }

    public function show(Request $request, Roastery $roastery): Response
    {
        $beans = $roastery->beans()
            ->withCount(['reviews', 'recipes'])
            ->withAvg('reviews as average_rating', 'rating')
            ->orderByDesc('created_at')
            ->paginate(12);

        return Inertia::render('Roasteries/Show', [
            'roastery' => $roastery,
            'beans' => $beans,
        ]);
    }
}
