<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRoasteryRequest;
use App\Models\Roastery;
use App\Services\UpdateRoastery;
use Illuminate\Http\RedirectResponse;
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

    public function edit(Roastery $roastery): Response
    {
        $this->authorize('update', $roastery);

        return Inertia::render('Roasteries/Edit', [
            'roastery' => $roastery,
        ]);
    }

    public function update(UpdateRoasteryRequest $request, Roastery $roastery): RedirectResponse
    {
        $this->authorize('update', $roastery);

        $data = $request->safe()->only(['location', 'contact']);

        $social = array_filter([
            'instagram' => $request->string('instagram')->toString() ?: null,
            'website' => $request->string('website')->toString() ?: null,
        ]);

        $data['social'] = $social === [] ? null : $social;

        app(UpdateRoastery::class)->update($request->user(), $roastery, $data);

        return redirect()->route('roasteries.show', $roastery)->with('flash', [
            'type' => 'success',
            'message' => 'Info roastery berhasil diperbarui.',
        ]);
    }
}
