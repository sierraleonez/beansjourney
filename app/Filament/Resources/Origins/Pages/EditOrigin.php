<?php

namespace App\Filament\Resources\Origins\Pages;

use App\Filament\Resources\Origins\OriginResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOrigin extends EditRecord
{
    protected static string $resource = OriginResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
