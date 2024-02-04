<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GoodsWarehouse extends Model
{
    protected $table = 'goods_warehouse';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'address',
    ];
}
