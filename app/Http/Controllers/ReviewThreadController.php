<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Support\CommentTree;
use App\Support\PostPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewThreadController extends Controller
{
    public function show(Request $request, Review $review): Response
    {
        if ($review->trashed()) {
            abort(404);
        }

        $review->load('user:id,name,bio');
        $review->load('bean.roastery:id,name,location');
        $review->loadCount(['votes', 'comments']);

        $viewerId = $request->user()?->id;
        $review->votes_count = $review->votes_count ?? $review->votes()->count();

        return Inertia::render('Reviews/Show', [
            'review' => PostPresenter::review($review, $viewerId),
            'bean' => [
                'id' => $review->bean->id,
                'name' => $review->bean->name,
                'roastery' => $review->bean->roastery,
            ],
            'comments' => CommentTree::for(
                $review,
                $viewerId,
                $request->integer('page', 1),
                $request->integer('expand_root') ?: null,
            ),
            'comment_count' => $review->comments()->withTrashed()->count(),
            'canReply' => $request->user()?->hasVerifiedEmail() ?? false,
            'isAuthor' => $viewerId === $review->user_id,
        ]);
    }
}
