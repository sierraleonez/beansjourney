<?php

namespace App\Filament\Resources\Beans\Pages;

use App\Filament\Resources\Beans\BeanResource;
use App\Services\DeleteBean;
use App\Services\UpdateBean;
use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditBean extends EditRecord
{
    protected static string $resource = BeanResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        return app(UpdateBean::class)->update(auth()->user(), $record, $data);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->using(fn (Model $record) => app(DeleteBean::class)->delete(auth()->user(), $record)),
            RestoreAction::make()
                ->using(fn (Model $record) => app(UpdateBean::class)->restore(auth()->user(), $record)),
        ];
    }
}
