<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request): RedirectResponse
    {
        $this->authorize('create', Comment::class);

        $commentable = $request->commentable();

        abort_unless($commentable && ! $commentable->trashed(), 404);

        $parent = $request->validated('parent_id')
            ? Comment::withTrashed()->findOrFail($request->validated('parent_id'))
            : null;

        app(CommentService::class)->store(
            $request->user(),
            $commentable,
            $request->string('body')->toString(),
            $parent,
        );

        return back();
    }

    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $this->authorize('delete', $comment);

        app(CommentService::class)->softDelete($request->user(), $comment);

        return back();
    }
}
