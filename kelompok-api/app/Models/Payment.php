<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = "payments";

    protected $fillable = [
        'order_id', 'method', 'proof', 'status', 'paid_at', 'confirmed_at'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
