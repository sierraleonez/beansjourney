<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UpdatePost
{
    /**
     * Admin moderation edit for Review, Recipe or Comment.
     */
    public function update(User $actor, Model $post, array $data): Model
    {
        $post->fill($data);
        $post->save();

        ActivityLog::record($actor, 'updated', $post);

        return $post;
    }

    public function restore(User $actor, Model $post): Model
    {
        $post->restore();

        ActivityLog::record($actor, 'restored', $post);

        return $post;
    }
}
