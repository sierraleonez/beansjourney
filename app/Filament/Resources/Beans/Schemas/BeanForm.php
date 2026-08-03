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
                FileUpload::make('photos')
                    ->label('Photos')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->disk('public')
                    ->directory('beans')
                    ->relationship('photos', 'path')
                    ->columnSpanFull(),
                Select::make('process_id')
                    ->label('Proses')
                    ->relationship('process', 'name')
                    ->searchable()
                    ->preload(),
                Select::make('origin_id')
                    ->label('Asal')
                    ->relationship('origin', 'name')
                    ->searchable()
                    ->preload(),
                TextInput::make('variety')
                    ->maxLength(255),
                Textarea::make('flavour_perception')
                    ->rows(3)
                    ->columnSpanFull(),
                DatePicker::make('roast_date'),
                Select::make('roast_level_id')
                    ->label('Tingkat Sangrai')
                    ->relationship('roastLevel', 'name')
                    ->searchable()
                    ->preload(),
                Select::make('purpose_id')
                    ->label('Peruntukan')
                    ->relationship('purpose', 'name')
                    ->searchable()
                    ->preload(),
                DatePicker::make('purchased_on'),
                TextInput::make('altitude')
                    ->maxLength(255),
            ]);
    }
}
