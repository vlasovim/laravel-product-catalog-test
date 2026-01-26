<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductCreationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_create_product_successfully(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'description' => 'Test product description',
            'price' => 99.99,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'category' => [
                        'id',
                        'name',
                        'description',
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Test Product',
                    'description' => 'Test product description',
                    'price' => 99.99,
                ]
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'price' => 99.99,
            'category_id' => $category->id,
        ]);
    }

    public function test_create_product_unauthorized(): void
    {
        $category = Category::factory()->create();

        $productData = [
            'name' => 'Test Product',
            'price' => 99.99,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(401);
    }

    public function test_create_product_without_name(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'description' => 'Test product description',
            'price' => 99.99,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message'
            ])
            ->assertJson([
                'success' => false
            ]);
    }

    public function test_create_product_with_nonexistent_category(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'price' => 99.99,
            'category_id' => 999,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_with_negative_price(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'price' => -10,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_with_zero_price(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'price' => 0,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_with_long_name(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => str_repeat('a', 256),
            'price' => 99.99,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_without_category(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'price' => 99.99,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_without_price(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_with_non_numeric_price(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Test Product',
            'price' => 'not-a-number',
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(422);
    }

    public function test_create_product_with_minimal_data(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $productData = [
            'name' => 'Minimal Product',
            'price' => 1,
            'category_id' => $category->id,
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Minimal Product',
                    'price' => 1,
                ]
            ]);
    }
}
