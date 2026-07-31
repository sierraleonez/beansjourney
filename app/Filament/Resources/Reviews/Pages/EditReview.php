<?php

namespace App\Filament\Resources\Reviews\Pages;

use App\Filament\Resources\Reviews\ReviewResource;
use App\Services\DeletePost;
use App\Services\UpdatePost;
use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditReview extends EditRecord
{
    protected static string $resource = ReviewResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        return app(UpdatePost::class)->update(auth()->user(), $record, $data);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->using(fn (Model $record) => app(DeletePost::class)->delete(auth()->user(), $record, 'admin')),
            RestoreAction::make()
                ->using(fn (Model $record) => app(UpdatePost::class)->restore(auth()->user(), $record)),
        ];
    }
}
