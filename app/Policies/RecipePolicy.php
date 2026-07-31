<?php

namespace App\Policies;

use App\Models\Recipe;
use App\Models\User;

class RecipePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Recipe $recipe): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function update(User $user, Recipe $recipe): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Recipe $recipe): bool
    {
        return $user->isAdmin() || $user->id === $recipe->user_id;
    }

    public function restore(User $user, Recipe $recipe): bool
    {
        return $user->isAdmin();
    }
}
