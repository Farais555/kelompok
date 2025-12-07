<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\SellController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('/products', ProductController::class)->only(['index', 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/orders/{orderId}/payment', [PaymentController::class, 'store']);


Route::middleware(['auth:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('/users', UserController::class);

    // Route::get('/user', [UserController::class, 'me']);
    // Route::put('/user', [UserController::class, 'updateSelf']);
    // Route::delete('/user', [UserController::class, 'deleteSelf']);
    Route::apiResource('/users', UserController::class)->only(['update']);

    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('/products', ProductController::class)->only(['update', 'store', 'destroy']);
    });
});
Route::apiResource('payments', PaymentController::class);
