<?php

namespace App\Filament\Resources\Beans;

use App\Filament\Resources\Beans\Pages\CreateBean;
use App\Filament\Resources\Beans\Pages\EditBean;
use App\Filament\Resources\Beans\Pages\ListBeans;
use App\Filament\Resources\Beans\Schemas\BeanForm;
use App\Filament\Resources\Beans\Tables\BeansTable;
use App\Models\Bean;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BeanResource extends Resource
{
    protected static ?string $model = Bean::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return BeanForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BeansTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBeans::route('/'),
            'create' => CreateBean::route('/create'),
            'edit' => EditBean::route('/{record}/edit'),
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
