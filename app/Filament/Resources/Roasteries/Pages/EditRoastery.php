<?php

namespace App\Filament\Resources\Roasteries\Pages;

use App\Filament\Resources\Roasteries\RoasteryResource;
use App\Services\DeleteRoastery;
use App\Services\UpdateRoastery;
use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditRoastery extends EditRecord
{
    protected static string $resource = RoasteryResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        return app(UpdateRoastery::class)->update(auth()->user(), $record, $data);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->using(fn (Model $record) => app(DeleteRoastery::class)->delete(auth()->user(), $record)),
            RestoreAction::make()
                ->using(fn (Model $record) => app(UpdateRoastery::class)->restore(auth()->user(), $record)),
        ];
    }
}
