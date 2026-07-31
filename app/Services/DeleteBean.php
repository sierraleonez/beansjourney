<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\User;

class DeleteBean
{
    public function delete(User $actor, Bean $bean): void
    {
        $bean->delete();

        ActivityLog::record($actor, 'deleted', $bean);
    }
}
