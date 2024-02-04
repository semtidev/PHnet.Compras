<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DepartmentRequest extends Pivot
{
    protected $table = 'department_requests';
    public $timestamps = false;
	public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_department', 'id_request',
    ];
}
