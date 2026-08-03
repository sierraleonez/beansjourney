<?php

namespace App\Filament\Resources\Beans\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BeansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('roastery.name')
                    ->label('Roastery')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('origin.name')
                    ->label('Asal')
                    ->toggleable(),
                TextColumn::make('roastLevel.name')
                    ->label('Tingkat Sangrai')
                    ->toggleable(),
                TextColumn::make('reviews_count')
                    ->label('Reviews')
                    ->counts('reviews')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->using(fn (\App\Models\Bean $record) => app(\App\Services\DeleteBean::class)->delete(auth()->user(), $record)),
            ]);
    }
}
