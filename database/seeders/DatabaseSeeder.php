<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
        ]);

        $categories = Category::factory()->count(10)->create();

        $categories->each(function ($category) {
            Product::factory()
                ->count(rand(5, 10))
                ->create(['category_id' => $category->id]);
        });
    }
}
