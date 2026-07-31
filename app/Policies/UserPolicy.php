<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function update(User $actor, User $user): bool
    {
        return $actor->id === $user->id || $actor->isAdmin();
    }

    public function delete(User $actor, User $user): bool
    {
        return $actor->id === $user->id || $actor->isAdmin();
    }
}
