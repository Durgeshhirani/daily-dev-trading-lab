<?php

use App\Http\Controllers\MyController69;
use App\Http\Controllers\phpController;
use Illuminate\Support\Facades\Route;

// testing error
Route::get('/test', [MyController69::class, 'test']);

Route::inertia('/', 'welcome')->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

Route::get('/runphp', [phpController::class, 'funphp']);

Route::get('/welcome', function () {
    $count = 0;
    function increase()
    {
        global $count;
        $count++;
    }

    // $increase = ($count) => $count +1;
    return view('welcome', ['count' => $count]);
});

require __DIR__ . '/settings.php';
