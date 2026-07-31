<?php

namespace App\Filament\Resources\Beans\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BeanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Select::make('roastery_id')
                    ->label('Roastery')
                    ->relationship('roastery', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull(),
                FileUpload::make('photo_path')
                    ->label('Photo')
                    ->image()
                    ->disk('public')
                    ->directory('beans')
                    ->columnSpanFull(),
                TextInput::make('process')
                    ->maxLength(255),
                TextInput::make('origin')
                    ->maxLength(255),
                TextInput::make('variety')
                    ->maxLength(255),
                Textarea::make('flavour_perception')
                    ->rows(3)
                    ->columnSpanFull(),
                DatePicker::make('roast_date'),
                Select::make('roast_profile')
                    ->options([
                        'Light' => 'Light',
                        'Light-Medium' => 'Light-Medium',
                        'Medium' => 'Medium',
                        'Medium-Dark' => 'Medium-Dark',
                        'Dark' => 'Dark',
                    ]),
                TextInput::make('purpose')
                    ->maxLength(255),
                DatePicker::make('purchased_on'),
                TextInput::make('altitude')
                    ->maxLength(255),
            ]);
    }
}
