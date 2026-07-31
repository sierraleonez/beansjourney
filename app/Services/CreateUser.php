<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

class CreateUser
{
    public function create(array $data, bool $recordActivity = false): User
    {
        $user = User::create($data);

        if ($recordActivity) {
            ActivityLog::record($user, 'created', $user);
        }

        return $user;
    }
}
