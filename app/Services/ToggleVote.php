<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Vote;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\UniqueConstraintViolationException;

class ToggleVote
{
    /**
     * Toggle an upvote. Returns the new state: ['voted' => bool, 'count' => int].
     */
    public function toggle(User $user, Model $votable): array
    {
        $existing = Vote::where('votable_type', $votable->getMorphClass())
            ->where('votable_id', $votable->getKey())
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $action = 'unvoted';
        } else {
            try {
                $votable->votes()->create(['user_id' => $user->id]);
            } catch (UniqueConstraintViolationException) {
                // Lost a concurrent create race: the canonical row already exists,
                // so this user is (still) voted. Re-read and leave the row alone.
            }
            $action = 'voted';
        }

        ActivityLog::record($user, $action, $votable);

        return [
            'voted' => Vote::where('votable_type', $votable->getMorphClass())
                ->where('votable_id', $votable->getKey())
                ->where('user_id', $user->id)
                ->exists(),
            'count' => Vote::where('votable_type', $votable->getMorphClass())
                ->where('votable_id', $votable->getKey())
                ->count(),
        ];
    }
}
