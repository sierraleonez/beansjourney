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

        $dirty = $bean->getDirty();
        $changes = [];

        foreach ($dirty as $key => $value) {
            $changes[$key] = [
                'from' => $bean->getOriginal($key),
                'to' => $value,
            ];
        }

        $bean->save();

        ActivityLog::record($actor, 'updated', $bean, $changes === [] ? null : ['changes' => $changes]);

        return $bean;
    }

    public function restore(User $actor, Bean $bean): Bean
    {
        $bean->restore();

        ActivityLog::record($actor, 'restored', $bean);

        return $bean;
    }
}
