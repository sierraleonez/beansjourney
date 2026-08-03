<?php

namespace App\Filament\Resources\Purposes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PurposeForm
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
