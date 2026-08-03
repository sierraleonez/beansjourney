<?php

namespace App\Filament\Resources\Origins\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OriginForm
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
