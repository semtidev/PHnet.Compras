<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShoppingRequest extends Model
{
    protected $table = 'shopping_requests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_work', 'id_department', 'id_warehouse', 'id_shopping_type', 'id_shopping_state', 'document_date', 'code', 'name', 'approval_number', 'management_code', 'comment', 'quote', 'document', 'parent', 'circuit', 'active', 'esp_confirm', 'dpto_confirm', 'comp_comfirm', 'dir_confirm', 'gendir_aprove', 'gendir_reject',
    ];

    /**
     *  Get Shopping Request Products.
     */
    public function products() {
        return $this->hasMany('App\ShoppingRequestProduct', 'id_request');
    }

    /**
     *  Get Shopping Request Tracking.
     */
    public function tracking() {
        return $this->hasOne('App\RequestTracking', 'id_request');
    }

    /**
     *  Get the work that owns the request.
     */
    public function work() {
        return $this->belongsTo('App\Work', 'id_work');
    }

    /**
     *  Get the department that owns the request.
     */
    public function departments() {
        return $this->belongsToMany('App\Department', 'department_requests', 'id_request', 'id_department');
    }
}
