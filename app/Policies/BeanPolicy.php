<?php

namespace App\Policies;

use App\Models\Bean;
use App\Models\User;

class BeanPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Bean $bean): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function update(User $user, Bean $bean): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Bean $bean): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Bean $bean): bool
    {
        return $user->isAdmin();
    }
}
