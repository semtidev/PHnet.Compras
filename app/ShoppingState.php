<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShoppingState extends Model
{
    protected $table = 'shopping_states';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'state',
    ];
}
