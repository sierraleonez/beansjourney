<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReviewForm
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
                Select::make('rating')
                    ->options([1 => '1 star', 2 => '2 stars', 3 => '3 stars', 4 => '4 stars', 5 => '5 stars'])
                    ->required(),
                TextInput::make('brew_method')
                    ->label('Brew method')
                    ->maxLength(100),
                Textarea::make('body')
                    ->rows(5)
                    ->required()
                    ->maxLength(5000)
                    ->columnSpanFull(),
            ]);
    }
}
