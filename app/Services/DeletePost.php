<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class DeletePost
{
    /**
     * @param  Model  $post  Review, Recipe or Comment. Comment delegates to CommentService.
     * @param  'author'|'admin'  $mode
     */
    public function delete(User $actor, Model $post, string $mode = 'author'): void
    {
        if ($post instanceof Comment) {
            app(CommentService::class)->softDelete($actor, $post);

            return;
        }

        $post->delete();

        if ($mode === 'admin') {
            ActivityLog::record($actor, 'deleted', $post);
        }
    }
}
