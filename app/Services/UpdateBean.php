<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\User;

class UpdateBean
{
    public function update(User $actor, Bean $bean, array $data): Bean
    {
        $bean->fill($data);
        $bean->save();

        ActivityLog::record($actor, 'updated', $bean);

        return $bean;
    }

    public function restore(User $actor, Bean $bean): Bean
    {
        $bean->restore();

        ActivityLog::record($actor, 'restored', $bean);

        return $bean;
    }
}
