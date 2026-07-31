<?php

namespace App\Filament\Resources\Roasteries\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RoasteryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                TextInput::make('contact')
                    ->maxLength(255),
                TextInput::make('location')
                    ->maxLength(255),
                KeyValue::make('social')
                    ->label('Social media')
                    ->addActionLabel('Add handle')
                    ->keyLabel('Network')
                    ->valueLabel('Handle'),
            ]);
    }
}
