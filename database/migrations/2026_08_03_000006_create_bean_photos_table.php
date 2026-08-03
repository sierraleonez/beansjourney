<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bean_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bean_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->timestamps();
        });

        $this->backfill();

        Schema::table('beans', function (Blueprint $table) {
            $table->dropColumn('photo_path');
        });
    }

    public function down(): void
    {
        Schema::table('beans', function (Blueprint $table) {
            $table->string('photo_path')->nullable()->after('altitude');
        });

        foreach (DB::table('bean_photos')->orderBy('id')->get() as $photo) {
            DB::table('beans')
                ->where('id', $photo->bean_id)
                ->whereNull('photo_path')
                ->update(['photo_path' => $photo->path]);
        }

        Schema::dropIfExists('bean_photos');
    }

    /**
     * Backfill: turn each existing beans.photo_path into a single bean_photos row.
     */
    private function backfill(): void
    {
        $now = now();

        DB::table('beans')
            ->whereNotNull('photo_path')
            ->where('photo_path', '!=', '')
            ->orderBy('id')
            ->get(['id', 'photo_path'])
            ->each(function ($bean) use ($now) {
                DB::table('bean_photos')->insert([
                    'bean_id' => $bean->id,
                    'path' => $bean->photo_path,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            });
    }
};
