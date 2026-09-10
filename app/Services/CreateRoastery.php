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
        $name = trim($name);

        if ($roastery = $this->findByName($name)) {
            return $roastery;
        }

        try {
            return $this->create($actor, $name, null, $social, $location);
        } catch (UniqueConstraintViolationException) {
            $roastery = Roastery::withTrashed()->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])->firstOrFail();

            if ($roastery->trashed()) {
                $roastery->restore();
            }

            return $roastery;
        }
    }

    /**
     * Case-insensitive lookup so "Blue Bottle" and "blue bottle" resolve to the same roastery
     * instead of the DB's case-sensitive unique index letting a near-duplicate slip through.
     */
    public function findByName(string $name): ?Roastery
    {
        return Roastery::whereRaw('LOWER(name) = ?', [mb_strtolower(trim($name))])->first();
    }
}
