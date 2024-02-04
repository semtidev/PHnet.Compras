<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'department', 'photo', 'position',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

	/**
     * The roles that belong to the user.
     */
    public function roles() {
		return $this->belongsToMany('App\Role', 'role_user', 'user_id', 'role_id');
	}

	/**
     * The works that belong to the user.
     */
    public function works() {
		return $this->belongsToMany('App\Work', 'user_work', 'user_id', 'work_id');
	}
}
