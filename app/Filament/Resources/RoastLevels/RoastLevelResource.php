<?php

namespace App\Filament\Resources\RoastLevels;

use App\Filament\Resources\RoastLevels\Pages\CreateRoastLevel;
use App\Filament\Resources\RoastLevels\Pages\EditRoastLevel;
use App\Filament\Resources\RoastLevels\Pages\ListRoastLevels;
use App\Filament\Resources\RoastLevels\Schemas\RoastLevelForm;
use App\Filament\Resources\RoastLevels\Tables\RoastLevelsTable;
use App\Models\RoastLevel;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class RoastLevelResource extends Resource
{
    protected static ?string $model = RoastLevel::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFire;

    protected static string|UnitEnum|null $navigationGroup = 'Master Data';

    protected static ?string $navigationLabel = 'Tingkat Sangrai';

    protected static ?string $modelLabel = 'Tingkat Sangrai';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return RoastLevelForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoastLevelsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoastLevels::route('/'),
            'create' => CreateRoastLevel::route('/create'),
            'edit' => EditRoastLevel::route('/{record}/edit'),
        ];
    }
}
