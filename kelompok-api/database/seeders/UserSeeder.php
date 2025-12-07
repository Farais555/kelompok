<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin asli',
            'email' => 'admin@contoh.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Surya Mencari Cahaya Nur Light',
            'email' => 'dummy@contoh.com',
            'password' => bcrypt('staff123'),
            'role' => 'staff'
        ]);
    }
}
