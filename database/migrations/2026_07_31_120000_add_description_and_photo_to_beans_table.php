<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beans', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('photo_path')->nullable()->after('altitude');
        });
    }

    public function down(): void
    {
        Schema::table('beans', function (Blueprint $table) {
            $table->dropColumn(['description', 'photo_path']);
        });
    }
};
