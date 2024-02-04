<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommentRequest extends Model
{
    protected $table = 'comment_requests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_user', 'id_request', 'comment', 'created_at', 'update_at'
    ];
}
