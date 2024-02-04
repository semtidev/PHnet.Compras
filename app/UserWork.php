<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserWork extends Pivot
{
    //protected $table = 'user_works';
    //public $timestamps = false;
	public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'work_id', 'create_at', 'updated_at',
    ];
}
