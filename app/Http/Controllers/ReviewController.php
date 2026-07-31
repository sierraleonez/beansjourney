<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Bean;
use App\Models\Review;
use App\Services\CreateReview;
use App\Services\DeletePost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Bean $bean): RedirectResponse
    {
        $this->authorize('create', Review::class);

        $data = $request->safe();

        app(CreateReview::class)->create(
            $request->user(),
            $bean,
            (int) $data['rating'],
            $data['body'],
            $data['brew_method'] ?? null,
        );

        return redirect()->route('beans.show', ['bean' => $bean, 'tab' => 'reviews'])
            ->with('flash', ['type' => 'success', 'message' => 'Review posted. Thanks for sharing!']);
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);

        app(DeletePost::class)->delete($request->user(), $review);

        return redirect()->route('beans.show', ['bean' => $review->bean_id, 'tab' => 'reviews']);
    }
}
