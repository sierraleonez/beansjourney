<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\Recipe;
use App\Models\User;

class CreateRecipe
{
    public function create(User $actor, Bean $bean, array $data): Recipe
    {
        $recipe = new Recipe(array_merge($data, [
            'bean_id' => $bean->id,
            'user_id' => $actor->id,
        ]));

        $recipe->save();

        ActivityLog::record($actor, 'created', $recipe);

        return $recipe;
    }
}
