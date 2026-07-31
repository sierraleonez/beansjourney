<?php

namespace App\Support;

use App\Models\Comment;
use App\Models\Recipe;
use App\Models\Review;

class PostPresenter
{
    public static function review(Review $review, ?int $viewerId): array
    {
        return self::base($review, $viewerId) + [
            'rating' => $review->rating,
            'brew_method' => $review->brew_method,
            'body' => $review->trashed() ? null : $review->body,
            'comment_count' => $review->comments_count ?? $review->comments()->count(),
        ];
    }

    public static function recipe(Recipe $recipe, ?int $viewerId): array
    {
        return self::base($recipe, $viewerId) + [
            'brew_method' => $recipe->brew_method,
            'tools' => $recipe->tools ?? [],
            'process' => $recipe->trashed() ? null : $recipe->process,
            'tasting_notes' => $recipe->trashed() ? null : $recipe->tasting_notes,
            'dose_ratio' => $recipe->dose_ratio,
            'grind_size' => $recipe->grind_size,
            'water_temp' => $recipe->water_temp,
            'comment_count' => $recipe->comments_count ?? $recipe->comments()->count(),
        ];
    }

    public static function comment(Comment $comment, ?int $viewerId): array
    {
        return self::base($comment, $viewerId) + [
            'parent_id' => $comment->parent_id,
            'body' => $comment->trashed() ? null : $comment->body,
            'deleted' => $comment->trashed(),
        ];
    }

    private static function base($model, ?int $viewerId): array
    {
        return [
            'id' => $model->id,
            'created_at' => $model->created_at?->toIso8601String(),
            'author' => $model->trashed() ? null : ($model->user ? [
                'id' => $model->user->id,
                'name' => $model->user->name,
                'bio' => $model->user->bio,
            ] : null),
            'votes_count' => $model->votes_count ?? $model->votes()->count(),
            'voted_by_user' => $model->voted_by_user ?? false,
        ];
    }
}
