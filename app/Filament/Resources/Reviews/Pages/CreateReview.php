<?php

namespace App\Filament\Resources\Reviews\Pages;

use App\Filament\Resources\Reviews\ReviewResource;
use App\Models\Bean;
use App\Services\CreateReview as CreateReviewService;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class CreateReview extends CreateRecord
{
    protected static string $resource = ReviewResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $bean = Bean::findOrFail($data['bean_id']);

        return app(CreateReviewService::class)->create(
            auth()->user(),
            $bean,
            (int) $data['rating'],
            $data['body'],
            $data['brew_method'] ?? null,
        );
    }
}
