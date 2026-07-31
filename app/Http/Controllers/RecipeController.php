<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Models\Bean;
use App\Models\Recipe;
use App\Services\CreateRecipe;
use App\Services\DeletePost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function store(StoreRecipeRequest $request, Bean $bean): RedirectResponse
    {
        $this->authorize('create', Recipe::class);

        $recipe = app(CreateRecipe::class)->create(
            $request->user(),
            $bean,
            $request->safe()->all(),
        );

        return redirect()->route('recipes.show', $recipe)
            ->with('flash', ['type' => 'success', 'message' => 'Recipe shared. Help the community brew this one well!']);
    }

    public function destroy(Request $request, Recipe $recipe): RedirectResponse
    {
        $this->authorize('delete', $recipe);

        app(DeletePost::class)->delete($request->user(), $recipe);

        return redirect()->route('beans.show', ['bean' => $recipe->bean_id, 'tab' => 'recipes']);
    }
}
