<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleVoteRequest;
use App\Models\Vote;
use App\Services\ToggleVote;
use Illuminate\Http\RedirectResponse;

class VoteController extends Controller
{
    public function toggle(ToggleVoteRequest $request): RedirectResponse
    {
        $this->authorize('create', Vote::class);

        $votable = $request->votable();

        abort_unless($votable && ! $votable->trashed(), 404);

        if ($votable instanceof \App\Models\Comment) {
            abort_unless(! $votable->commentable()->withTrashed()->first()?->trashed(), 404);
        }

        app(ToggleVote::class)->toggle($request->user(), $votable);

        return back();
    }
}
