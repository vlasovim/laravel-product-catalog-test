<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = $request->get('per_page', 15);
        $products = $query->paginate($perPage);

        return $this->paginatedResponse(
            ProductResource::collection($products)
        );
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return $this->createdResponse(
            ProductResource::make($product->load('category'))
        );
    }

    public function show(Product $product): JsonResponse
    {
        return $this->successResponse(
            ProductResource::make($product->load('category'))
        );
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return $this->successResponse(
            ProductResource::make($product->load('category'))
        );
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return $this->noContentResponse();
    }
}
