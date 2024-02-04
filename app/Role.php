<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

	/**
     * The users that belong to the rol.
     */
    public function users() {
		return $this->belongsToMany('App\User')->using('App\RoleUser');
	}
}
