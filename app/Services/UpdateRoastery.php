<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Roastery;
use App\Models\User;

class UpdateRoastery
{
    public function update(User $actor, Roastery $roastery, array $data): Roastery
    {
        $roastery->fill($data);
        $roastery->save();

        ActivityLog::record($actor, 'updated', $roastery);

        return $roastery;
    }

    public function restore(User $actor, Roastery $roastery): Roastery
    {
        $roastery->restore();

        ActivityLog::record($actor, 'restored', $roastery);

        return $roastery;
    }
}
