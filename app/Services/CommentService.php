<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CommentService
{
    public function store(User $actor, Model $commentable, string $body, ?Comment $parent = null): Comment
    {
        $comment = new Comment([
            'user_id' => $actor->id,
            'commentable_type' => $commentable->getMorphClass(),
            'commentable_id' => $commentable->getKey(),
            'parent_id' => $parent?->getKey(),
            'body' => $body,
        ]);

        $comment->save();

        ActivityLog::record($actor, 'created', $comment);

        return $comment;
    }

    public function softDelete(User $actor, Comment $comment): void
    {
        $comment->delete();

        if ($actor->isAdmin()) {
            ActivityLog::record($actor, 'deleted', $comment);
        }
    }
}
