<?php

namespace App\Filament\Resources\Roasteries\Pages;

use App\Filament\Resources\Roasteries\RoasteryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRoasteries extends ListRecords
{
    protected static string $resource = RoasteryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
