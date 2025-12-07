<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = "orders";

    protected $fillable = [
        'user_id', 'product_id', 'quantity', 'total_price', 'address','status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }

    // relasi ke Payment
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }


}
