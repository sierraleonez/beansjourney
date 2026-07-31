<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->email()
                    ->unique(ignoreRecord: true)
                    ->required()
                    ->maxLength(255),
                Select::make('role')
                    ->options([
                        'user' => 'User',
                        'admin' => 'Admin',
                    ])
                    ->required(),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->required()
                    ->hiddenOn('edit')
                    ->maxLength(255),
                Toggle::make('email_verified_at')
                    ->label('Email verified')
                    ->dehydrateStateUsing(fn (?bool $state) => $state ? now() : null),
                TextInput::make('bio')
                    ->maxLength(500),
                Select::make('roast_level')
                    ->options([
                        'Light' => 'Light',
                        'Light-Medium' => 'Light-Medium',
                        'Medium' => 'Medium',
                        'Medium-Dark' => 'Medium-Dark',
                        'Dark' => 'Dark',
                    ]),
                KeyValue::make('flavor_profile')
                    ->label('Flavor profile')
                    ->addActionLabel('Add flavor')
                    ->keyLabel('Flavor'),
            ]);
    }
}
