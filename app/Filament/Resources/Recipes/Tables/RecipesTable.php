<?php

namespace App\Filament\Resources\Recipes\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RecipesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('bean.name')
                    ->label('Bean')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('brew_method')
                    ->badge()
                    ->sortable(),
                TextColumn::make('votes_count')
                    ->label('Upvotes')
                    ->counts('votes')
                    ->sortable(),
                TextColumn::make('comments_count')
                    ->label('Comments')
                    ->counts('comments')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->using(fn (\App\Models\Recipe $record) => app(\App\Services\DeletePost::class)->delete(auth()->user(), $record, 'admin')),
            ]);
    }
}
