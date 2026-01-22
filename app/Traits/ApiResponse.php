<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    protected function successResponse(
        mixed   $data = null,
        ?string $message = null,
        int     $status = Response::HTTP_OK
    ): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        $response = array_filter($response, function ($value) {
            return !is_null($value);
        });

        return response()->json($response, $status);
    }

    protected function errorResponse(
        string $message,
        int    $status = Response::HTTP_BAD_REQUEST,
        ?array $errors = null,
        mixed  $data = null
    ): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        if ($data) {
            $response['data'] = $data;
        }

        return response()->json($response, $status);
    }

    protected function paginatedResponse(
        mixed   $collection,
        ?string $message = null
    ): JsonResponse
    {
        $data = [];

        if ($collection instanceof LengthAwarePaginator
            || $collection instanceof ResourceCollection
        ) {
            $data = [
                'items' => $collection->items(),
                'total' => $collection->total(),
                'count' => $collection->count(),
                'perPage' => $collection->perPage(),
                'currentPage' => $collection->currentPage(),
                'lastPage' => $collection->lastPage(),
            ];
        }

        return $this->successResponse($data, $message);
    }

    protected function createdResponse(
        mixed   $data = null,
        ?string $message = null
    ): JsonResponse
    {
        return $this->successResponse(
            data: $data,
            message: $message,
            status: Response::HTTP_CREATED
        );
    }

    protected function noContentResponse(): JsonResponse
    {
        return response()->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    protected function unauthorizedResponse(
        ?string $message = null
    ): JsonResponse
    {
        return $this->errorResponse(
            message: $message ?? 'Unauthorized',
            status: Response::HTTP_UNAUTHORIZED
        );
    }

    protected function forbiddenResponse(
        ?string $message = null
    ): JsonResponse
    {
        return $this->errorResponse(
            message: $message ?? 'Forbidden',
            status: Response::HTTP_FORBIDDEN
        );
    }

    protected function notFoundResponse(
        ?string $message = null
    ): JsonResponse
    {
        return $this->errorResponse(
            message: $message ?? 'Not found',
            status: Response::HTTP_NOT_FOUND
        );
    }

    protected function validationErrorResponse(
        ?string $message = null,
        ?array  $errors = null
    ): JsonResponse
    {
        return $this->errorResponse(
            message: $message ?? 'Validation failed',
            status: Response::HTTP_UNPROCESSABLE_ENTITY,
            errors: $errors
        );
    }

    protected function serverErrorResponse(
        ?string $message = null,
        ?array  $errors = null
    ): JsonResponse
    {
        return $this->errorResponse(
            message: $message ?? 'Server error',
            status: Response::HTTP_INTERNAL_SERVER_ERROR,
            errors: $errors
        );
    }
}
