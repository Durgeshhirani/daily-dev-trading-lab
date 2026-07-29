<?php

namespace Modules\Primagen\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// use Modules\Primagen\Database\Factories\PrimagenFactory;

class Primagen extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): PrimagenFactory
    // {
    //     // return PrimagenFactory::new();
    // }
}
