<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Bean;
use App\Models\User;

class CreateBean
{
    public function __construct(private readonly CreateRoastery $createRoastery)
    {
    }

    public function create(User $actor, string $roasteryName, array $data, array $roasteryInfo = [], array $photoPaths = []): Bean
    {
        $roastery = $this->createRoastery->findOrCreate(
            $actor,
            $roasteryName,
            $roasteryInfo['location'] ?? null,
            $roasteryInfo['social'] ?? null,
        );

        $bean = new Bean(array_merge($data, [
            'roastery_id' => $roastery->id,
            'created_by' => $actor->id,
        ]));

        $bean->save();

        foreach ($photoPaths as $path) {
            $bean->photos()->create(['path' => $path]);
        }

        ActivityLog::record($actor, 'created', $bean);

        return $bean;
    }
}
