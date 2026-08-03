<?php

namespace App\Filament\Resources\Origins;

use App\Filament\Resources\Origins\Pages\CreateOrigin;
use App\Filament\Resources\Origins\Pages\EditOrigin;
use App\Filament\Resources\Origins\Pages\ListOrigins;
use App\Filament\Resources\Origins\Schemas\OriginForm;
use App\Filament\Resources\Origins\Tables\OriginsTable;
use App\Models\Origin;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class OriginResource extends Resource
{
    protected static ?string $model = Origin::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static string|UnitEnum|null $navigationGroup = 'Master Data';

    protected static ?string $navigationLabel = 'Asal';

    protected static ?string $modelLabel = 'Asal';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return OriginForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OriginsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOrigins::route('/'),
            'create' => CreateOrigin::route('/create'),
            'edit' => EditOrigin::route('/{record}/edit'),
        ];
    }
}
