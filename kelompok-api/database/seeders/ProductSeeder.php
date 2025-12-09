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
            'price' => '175000',
            'description' => 'Alat',
            'stock' => '1000'
        ]);

        Product::create([
            'name' => 'Galon Aqua 19ℓ',
            'photo_product' => 'galon.jpg',
            'price' => '30000',
            'description' => 'Minuman',
            'stock' => '1000'
        ]);

        Product::create([
            'name' => 'Le mineral 15ℓ',
            'photo_product' => 'mineral.jpg',
            'price' => '25000',
            'description' => 'Minuman',
            'stock' => '1000'
        ]);

        Product::create([
            'name' => 'Galon Aqua 19l',
            'photo_product' => 'gasbright.png',
            'price' => '379000',
            'description' => 'alat untuk memasak',
            'stock' => '1000'
        ]);
    }
}
