<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Support\CommentTree;
use App\Support\PostPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecipeThreadController extends Controller
{
    public function show(Request $request, Recipe $recipe): Response
    {
        if ($recipe->trashed()) {
            abort(404);
        }

        $recipe->load('user:id,name,bio');
        $recipe->load('bean.roastery:id,name,location');
        $recipe->loadCount(['votes', 'comments']);

        $viewerId = $request->user()?->id;
        $recipe->voted_by_user = $viewerId ? $recipe->votes()->where('user_id', $viewerId)->exists() : false;

        return Inertia::render('Recipes/Show', [
            'recipe' => PostPresenter::recipe($recipe, $viewerId),
            'bean' => [
                'id' => $recipe->bean->id,
                'name' => $recipe->bean->name,
                'roastery' => $recipe->bean->roastery,
            ],
            'comments' => CommentTree::for(
                $recipe,
                $viewerId,
                $request->integer('page', 1),
                $request->integer('expand_root') ?: null,
            ),
            'comment_count' => $recipe->comments()->withTrashed()->count(),
            'canReply' => $request->user()?->hasVerifiedEmail() ?? false,
            'isAuthor' => $viewerId === $recipe->user_id,
        ]);
    }
}
