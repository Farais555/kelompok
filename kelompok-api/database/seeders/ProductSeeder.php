<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Gas 3kg',
            'photo_product' => 'gas.jpg',
            'price' => '25000',
            'description' => 'Alat',
            'stock' => '1000'
        ]);

        Product::create([
            'name' => 'Galon Aqua 19l',
            'photo_product' => 'galon.jpg',
            'price' => '20000',
            'description' => 'Minuman',
            'stock' => '1000'
        ]);
    }
}
