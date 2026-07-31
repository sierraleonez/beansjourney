<?php

namespace App\Filament\Resources\Roasteries;

use App\Filament\Resources\Roasteries\Pages\CreateRoastery;
use App\Filament\Resources\Roasteries\Pages\EditRoastery;
use App\Filament\Resources\Roasteries\Pages\ListRoasteries;
use App\Filament\Resources\Roasteries\Schemas\RoasteryForm;
use App\Filament\Resources\Roasteries\Tables\RoasteriesTable;
use App\Models\Roastery;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RoasteryResource extends Resource
{
    protected static ?string $model = Roastery::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingStorefront;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return RoasteryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoasteriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoasteries::route('/'),
            'create' => CreateRoastery::route('/create'),
            'edit' => EditRoastery::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
