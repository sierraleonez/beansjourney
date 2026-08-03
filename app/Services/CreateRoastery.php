<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Roastery;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;

class CreateRoastery
{
    public function create(User $actor, string $name, ?string $contact = null, ?array $social = null, ?string $location = null): Roastery
    {
        $roastery = new Roastery([
            'name' => $name,
            'contact' => $contact,
            'social' => $social,
            'location' => $location,
            'created_by' => $actor->id,
        ]);

        $roastery->save();

        ActivityLog::record($actor, 'created', $roastery);

        return $roastery;
    }

    public function findOrCreate(User $actor, string $name, ?string $location = null, ?array $social = null): Roastery
    {
        if ($roastery = Roastery::where('name', $name)->first()) {
            return $roastery;
        }

        try {
            return $this->create($actor, $name, null, $social, $location);
        } catch (UniqueConstraintViolationException) {
            $roastery = Roastery::withTrashed()->where('name', $name)->firstOrFail();

            if ($roastery->trashed()) {
                $roastery->restore();
            }

            return $roastery;
        }
    }
}
