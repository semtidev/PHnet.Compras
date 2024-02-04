<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Replacement extends Model
{
    protected $table = 'replacements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_user', 'date_from', 'date_to',
    ];
}
