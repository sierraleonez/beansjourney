<?php

namespace App\Filament\Resources\Beans\Pages;

use App\Filament\Resources\Beans\BeanResource;
use App\Models\Roastery;
use App\Services\CreateBean as CreateBeanService;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class CreateBean extends CreateRecord
{
    protected static string $resource = BeanResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $roastery = Roastery::findOrFail($data['roastery_id']);

        return app(CreateBeanService::class)->create(
            auth()->user(),
            $roastery->name,
            Arr::except($data, 'roastery_id'),
        );
    }
}
