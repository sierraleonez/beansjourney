<?php

namespace App\Policies;

use App\Models\Roastery;
use App\Models\User;

class RoasteryPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Roastery $roastery): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function update(User $user, Roastery $roastery): bool
    {
        return $user->isAdmin() || $user->id === $roastery->created_by;
    }

    public function delete(User $user, Roastery $roastery): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Roastery $roastery): bool
    {
        return $user->isAdmin();
    }
}
