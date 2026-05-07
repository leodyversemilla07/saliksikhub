<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('oai_records', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->unique(); // OAI identifier (oai:domain:type:id)
            $table->timestamp('datestamp'); // Last modification date
            $table->string('set_spec')->nullable(); // OAI set specification
            $table->morphs('recordable'); // Polymorphic relation (publication, issue, etc.)
            $table->string('metadata_format')->default('oai_dc'); // Metadata format (oai_dc, jats, etc.)
            $table->text('metadata')->nullable(); // Cached metadata XML
            $table->boolean('deleted')->default(false); // Tombstone for deleted records
            $table->timestamps();

            $table->index('identifier');
            $table->index('datestamp');
            $table->index('set_spec');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oai_records');
    }
};
