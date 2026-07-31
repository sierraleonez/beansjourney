<?php

use App\Http\Controllers\BeanController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\RecipeThreadController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReviewThreadController;
use App\Http\Controllers\RoasteryController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DiscoverController::class, 'index'])->name('discover');
Route::get('/roasters', [RoasteryController::class, 'index'])->name('roasteries.index');
Route::get('/roasters/{roastery}', [RoasteryController::class, 'show'])->name('roasteries.show');

Route::get('/beans/new', [BeanController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('beans.create');
Route::get('/beans/{bean}', [BeanController::class, 'show'])->name('beans.show');
Route::post('/beans', [BeanController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('beans.store');

Route::post('/beans/{bean}/reviews', [ReviewController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('reviews.store');

Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('reviews.destroy');

Route::post('/beans/{bean}/recipes', [RecipeController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('recipes.store');

Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('recipes.destroy');

Route::get('/reviews/{review}', [ReviewThreadController::class, 'show'])->name('reviews.show');
Route::get('/recipes/{recipe}', [RecipeThreadController::class, 'show'])->name('recipes.show');

Route::post('/comments', [CommentController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('comments.store');
Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('comments.destroy');

Route::post('/votes', [VoteController::class, 'toggle'])
    ->middleware(['auth', 'verified'])
    ->name('votes.toggle');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/dashboard', fn () => redirect()->route('discover'))->name('dashboard');

require __DIR__.'/auth.php';
