<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

class DeleteUser
{
    /**
     * Soft-delete a user. FKs to their content are RESTRICT, so a hard delete
     * would fail the moment the user has written anything; soft-delete keeps
     * their posts attributed to a [deleted] profile.
     */
    public function delete(User $actor, User $user): void
    {
        $user->delete();

        if ($actor->isAdmin() && $actor->id !== $user->id) {
            ActivityLog::record($actor, 'deleted', $user);
        }
    }
}
