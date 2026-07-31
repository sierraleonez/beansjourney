<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Roastery;
use App\Models\User;

class DeleteRoastery
{
    public function delete(User $actor, Roastery $roastery): void
    {
        $roastery->delete();

        ActivityLog::record($actor, 'deleted', $roastery);
    }
}
