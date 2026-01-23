<?php

use App\Http\Controllers\Web\SiteController;

Route::get('/{any}', [SiteController::class, 'index'])->where('any', '.*');
