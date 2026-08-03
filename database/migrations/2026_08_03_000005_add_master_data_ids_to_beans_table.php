<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Old bean string column => [new table, new fk column].
     *
     * @var array<string, array{0: string, 1: string}>
     */
    private array $map = [
        'process' => ['processes', 'process_id'],
        'origin' => ['origins', 'origin_id'],
        'roast_profile' => ['roast_levels', 'roast_level_id'],
        'purpose' => ['purposes', 'purpose_id'],
    ];

    public function up(): void
    {
        Schema::table('beans', function (Blueprint $table) {
            $table->foreignId('process_id')->nullable()->after('process')->constrained('processes')->nullOnDelete();
            $table->foreignId('origin_id')->nullable()->after('origin')->constrained('origins')->nullOnDelete();
            $table->foreignId('roast_level_id')->nullable()->after('roast_profile')->constrained('roast_levels')->nullOnDelete();
            $table->foreignId('purpose_id')->nullable()->after('purpose')->constrained('purposes')->nullOnDelete();
        });

        $this->backfill();

        Schema::table('beans', function (Blueprint $table) {
            $table->dropColumn(['process', 'origin', 'roast_profile', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::table('beans', function (Blueprint $table) {
            $table->string('process')->nullable()->after('name');
            $table->string('origin')->nullable()->after('process');
            $table->string('roast_profile')->nullable()->after('roast_date');
            $table->string('purpose')->nullable()->after('roast_profile');
        });

        Schema::table('beans', function (Blueprint $table) {
            $table->dropConstrainedForeignId('process_id');
            $table->dropConstrainedForeignId('origin_id');
            $table->dropConstrainedForeignId('roast_level_id');
            $table->dropConstrainedForeignId('purpose_id');
        });
    }

    /**
     * Backfill new *_id columns from the existing string columns before they are dropped.
     * Uses plain query builder rather than Eloquent models, since model shapes may change later.
     */
    private function backfill(): void
    {
        foreach ($this->map as $oldColumn => [$masterTable, $fkColumn]) {
            $values = DB::table('beans')
                ->whereNotNull($oldColumn)
                ->where($oldColumn, '!=', '')
                ->distinct()
                ->pluck($oldColumn);

            $idsByName = [];

            foreach ($values as $name) {
                $existing = DB::table($masterTable)->where('name', $name)->first();

                if ($existing) {
                    $idsByName[$name] = $existing->id;

                    continue;
                }

                $idsByName[$name] = DB::table($masterTable)->insertGetId([
                    'name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($idsByName as $name => $id) {
                DB::table('beans')->where($oldColumn, $name)->update([$fkColumn => $id]);
            }
        }
    }
};
