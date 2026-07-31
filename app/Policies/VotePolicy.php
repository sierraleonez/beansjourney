<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Model;

class VotePolicy
{
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function view(?User $user, Vote $vote): bool
    {
        return true;
    }

    public function update(User $user, Vote $vote): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function delete(User $user, Vote $vote): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function toggle(User $user, ?Model $votable = null): bool
    {
        return $user->hasVerifiedEmail();
    }
}
