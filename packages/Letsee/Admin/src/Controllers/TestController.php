<?php

namespace Package\Letsee\Admin\Controllers;

use Illuminate\Http\Request;

// use Inertia\Inertia;

class TestController
{
    public static function wel2(Request $request)
    {
        return response('hello', 200, []);
    }
}
