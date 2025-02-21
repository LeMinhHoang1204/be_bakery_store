<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::where('id', '1')->exists()) {
            User::create([
                'id' => '1',
                'firebase_uid' => 'admin@admin.com',
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => bcrypt('123123'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'api_token' => Str::random(80),
                'user_type' => 'user',
                'created_by' => '1'
            ])->assignRole('Administrator');
        }
    }
}
