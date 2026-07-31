<?php

namespace App\Filament\Resources\Comments\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CommentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('commentable_type')
                    ->label('On')
                    ->badge(),
                TextColumn::make('body')
                    ->limit(60)
                    ->wrap(),
                TextColumn::make('votes_count')
                    ->label('Upvotes')
                    ->counts('votes')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->using(fn (\App\Models\Comment $record) => app(\App\Services\CommentService::class)->softDelete(auth()->user(), $record)),
            ]);
    }
}
