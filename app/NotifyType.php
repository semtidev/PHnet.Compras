<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NotifyType extends Model
{
    protected $table = 'notify_types';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'category',
    ];
}
