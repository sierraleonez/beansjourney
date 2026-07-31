<?php

namespace App\Filament\Resources\Beans\Pages;

use App\Filament\Resources\Beans\BeanResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBeans extends ListRecords
{
    protected static string $resource = BeanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
