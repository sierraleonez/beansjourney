<?php

namespace App\Filament\Resources\Recipes\Pages;

use App\Filament\Resources\Recipes\RecipeResource;
use App\Models\Bean;
use App\Services\CreateRecipe as CreateRecipeService;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class CreateRecipe extends CreateRecord
{
    protected static string $resource = RecipeResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $bean = Bean::findOrFail($data['bean_id']);

        return app(CreateRecipeService::class)->create(
            auth()->user(),
            $bean,
            Arr::except($data, 'bean_id'),
        );
    }
}
