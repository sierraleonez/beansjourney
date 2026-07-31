<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roasteries', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('contact')->nullable();
            $table->json('social')->nullable();
            $table->string('location')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('beans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('roastery_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('process')->nullable();
            $table->string('origin')->nullable();
            $table->string('variety')->nullable();
            $table->text('flavour_perception')->nullable();
            $table->date('roast_date')->nullable();
            $table->string('roast_profile')->nullable();
            $table->string('purpose')->nullable();
            $table->date('purchased_on')->nullable();
            $table->string('altitude')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['roastery_id', 'name']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bean_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('body');
            $table->string('brew_method')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['bean_id', 'created_at']);
        });

        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bean_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->enum('brew_method', ['americano', 'espresso', 'v60', 'french_press', 'aeropress', 'tubruk', 'other']);
            $table->json('tools')->nullable();
            $table->text('process')->nullable();
            $table->text('tasting_notes')->nullable();
            $table->string('dose_ratio')->nullable();
            $table->string('grind_size')->nullable();
            $table->string('water_temp')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['bean_id', 'created_at']);
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->morphs('commentable');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->text('body');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_id')->references('id')->on('comments')->restrictOnDelete();
            $table->index(['commentable_type', 'commentable_id', 'created_at']);
        });

        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->morphs('votable');
            $table->timestamps();

            $table->unique(['votable_type', 'votable_id', 'user_id'], 'votes_unique');
            $table->index('user_id');
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('action');
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['subject_type', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('votes');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('beans');
        Schema::dropIfExists('roasteries');
    }
};
