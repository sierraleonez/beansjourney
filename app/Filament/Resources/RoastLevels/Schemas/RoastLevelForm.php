<?php

namespace App\Filament\Resources\RoastLevels\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RoastLevelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
            ]);
    }
}
