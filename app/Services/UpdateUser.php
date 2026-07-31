<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

class UpdateUser
{
    public function update(User $actor, User $user, array $data): User
    {
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        ActivityLog::record($actor, 'updated', $user);

        return $user;
    }
}
