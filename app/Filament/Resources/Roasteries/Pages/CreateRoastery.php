<?php

namespace App\Filament\Resources\Roasteries\Pages;

use App\Filament\Resources\Roasteries\RoasteryResource;
use App\Services\CreateRoastery as CreateRoasteryService;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateRoastery extends CreateRecord
{
    protected static string $resource = RoasteryResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        return app(CreateRoasteryService::class)->create(
            auth()->user(),
            $data['name'],
            $data['contact'] ?? null,
            $data['social'] ?? null,
            $data['location'] ?? null,
        );
    }
}
