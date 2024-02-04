<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RequestTracking extends Model
{
    protected $table = 'request_tracking';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_request', 'code_almest', 'code_requested', 'import_invoice', 'code_invoice', 'contract_value', 'contract_code', 'comment',
    ];
}
