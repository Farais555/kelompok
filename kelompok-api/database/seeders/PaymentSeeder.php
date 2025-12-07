<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Payment::create([
            'order_id' => '1',
            'method' => 'cod',
            'proof' => null,
            'status' => 'cod',
            'paid_at' => null,
            'confirmed_at' => '2025-11-12',
        ]);

        Payment::create([
            'order_id' => '2',
            'method' => 'transfer',
            'proof' => 'transfer.jpg',
            'status' => 'paid',
            'paid_at' => '2025-11-12',
            'confirmed_at' => '2025-11-12',
        ]);
    }
}
