<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::create([
            "user_id" => "2",
            "product_id" => "2",
            "quantity" => "3",
            "total_price" => "20000",
            "address" => "jakarta",
            "status" => "pending",
            "phone" => "0812xxxx"
        ]);

        Order::create([
            "user_id" => "2",
            "product_id" => "1",
            "quantity" => "4",
            "total_price" => "100000",
            "address" => "jakarta",
            "status" => "approved",
            "phone" => "0813xxxx"
        ]);
    }
}
