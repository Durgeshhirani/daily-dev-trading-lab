<?php

namespace Modules\Fireship\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FireshipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('fireship::index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('fireship::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('fireship::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('fireship::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {}

    public function fireship()
    {
        return response('fireship', 200);
    }
}
