<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LogUser extends Model
{
    protected $table = 'log_user';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_user', 'action', 'created_at', 'client', 'rol'
    ];
}
