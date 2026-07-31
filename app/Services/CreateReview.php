<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\Review;
use App\Models\User;

class CreateReview
{
    public function create(User $actor, Bean $bean, int $rating, string $body, ?string $brewMethod = null): Review
    {
        $review = new Review([
            'bean_id' => $bean->id,
            'user_id' => $actor->id,
            'rating' => $rating,
            'body' => $body,
            'brew_method' => $brewMethod,
        ]);

        $review->save();

        ActivityLog::record($actor, 'created', $review);

        return $review;
    }
}
