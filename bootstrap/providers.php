<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use Package\Letsee\Admin\AdminServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    AdminServiceProvider::class,
];
