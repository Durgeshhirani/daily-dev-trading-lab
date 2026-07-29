<?php

use Illuminate\Support\Facades\Route;
use Modules\Primagen\Http\Controllers\PrimagenController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('primagens', PrimagenController::class)->names('primagen');
});

Route::get('/primagen', function () {
    return response('primagen', 200);
});
