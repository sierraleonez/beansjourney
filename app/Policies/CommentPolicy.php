<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function view(?User $user, Comment $comment): bool
    {
        return true;
    }

    public function update(User $user, Comment $comment): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Comment $comment): bool
    {
        return $user->isAdmin() || $user->id === $comment->user_id;
    }

    public function restore(User $user, Comment $comment): bool
    {
        return $user->isAdmin();
    }
}
