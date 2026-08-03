<?php

namespace App\Filament\Resources\RoastLevels\Pages;

use App\Filament\Resources\RoastLevels\RoastLevelResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRoastLevels extends ListRecords
{
    protected static string $resource = RoastLevelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
