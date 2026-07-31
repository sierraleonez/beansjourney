<?php

namespace App\Filament\Resources\Recipes\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RecipeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Select::make('bean_id')
                    ->label('Bean')
                    ->relationship('bean', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('brew_method')
                    ->options([
                        'americano' => 'Americano',
                        'espresso' => 'Espresso',
                        'v60' => 'V60',
                        'french_press' => 'French Press',
                        'aeropress' => 'AeroPress',
                        'tubruk' => 'Tubruk',
                        'other' => 'Other',
                    ])
                    ->required(),
                TextInput::make('dose_ratio')
                    ->label('Dose / ratio')
                    ->maxLength(100),
                TextInput::make('grind_size')
                    ->maxLength(100),
                TextInput::make('water_temp')
                    ->maxLength(100),
                KeyValue::make('tools')
                    ->label('Tools used')
                    ->addActionLabel('Add tool')
                    ->keyLabel('Tool')
                    ->valueLabel('Detail'),
                Textarea::make('process')
                    ->rows(5)
                    ->maxLength(10000)
                    ->columnSpanFull(),
                Textarea::make('tasting_notes')
                    ->rows(3)
                    ->maxLength(5000)
                    ->columnSpanFull(),
            ]);
    }
}
