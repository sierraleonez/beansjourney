<?php

namespace App\Filament\Widgets;

use App\Models\Bean;
use App\Models\Comment;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\Roastery;
use App\Models\User;
use App\Models\Vote;
use Filament\Widgets\StatsOverviewWidget as BaseStatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseStatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Users', User::count()),
            Stat::make('Roasteries', Roastery::count()),
            Stat::make('Beans', Bean::count()),
            Stat::make('Reviews', Review::count()),
            Stat::make('Recipes', Recipe::count()),
            Stat::make('Comments', Comment::count()),
            Stat::make('Upvotes', Vote::count()),
        ];
    }
}
