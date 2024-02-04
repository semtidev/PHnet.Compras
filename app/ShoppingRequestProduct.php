<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShoppingRequestProduct extends Model
{
    protected $table = 'shopping_request_products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_request', 'id_contract', 'code', 'description', 'ctdad', 'price', 'um', 'characteristic', 'photo',
    ];

}
