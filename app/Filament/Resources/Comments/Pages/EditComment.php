<?php

namespace App\Filament\Resources\Comments\Pages;

use App\Filament\Resources\Comments\CommentResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditComment extends EditRecord
{
    protected static string $resource = CommentResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        return app(\App\Services\UpdatePost::class)->update(auth()->user(), $record, $data);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->using(fn (Model $record) => app(\App\Services\CommentService::class)->softDelete(auth()->user(), $record)),
            RestoreAction::make()
                ->using(fn (Model $record) => app(\App\Services\UpdatePost::class)->restore(auth()->user(), $record)),
        ];
    }
}
