<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $table = 'works';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'abbr', 'shoppingrequest', 'contracts', 'planning', 'active', 'id_company_type', 'id_goods_warehouse',
    ];

	/**
     * The users that belong to the work.
     */
    public function users() {
		return $this->belongsToMany('App\User')->using('App\UserWork');
	}
}
