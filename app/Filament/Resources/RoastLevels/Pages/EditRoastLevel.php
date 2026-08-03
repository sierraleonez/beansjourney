<?php

namespace App\Filament\Resources\RoastLevels\Pages;

use App\Filament\Resources\RoastLevels\RoastLevelResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRoastLevel extends EditRecord
{
    protected static string $resource = RoastLevelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
