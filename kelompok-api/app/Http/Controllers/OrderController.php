<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    //tampilkan semua order
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->get('per_page', 5);

        // Tentukan kueri dasar
        if ($user->role === 'admin') {
            // KONDISI 1: ADMIN - Ambil SEMUA order
            $query = Order::query();
        } else {
            // KONDISI 2: STAFF/PETUGAS - Hanya ambil order miliknya sendiri
            $query = Order::where('user_id', $user->id);
        }

        $orders = $query->with('user', 'product')->paginate($perPage);

        return response()->json([
            "success" => true,
            "message" => "Get all Orders",
            "data" => $orders
        ], 200);
    }

    // tambah data
    public function store(Request $request)
    {
        // 1. validator
        $validator = Validator::make($request->all(), [
            "user_id" => "required|exists:users,id",
            "product_id" => "required|exists:products,id",
            "quantity" => "required|integer|min:1",
            "address" => "required|string|max:255"
        ]);

        // 2. cek validator error
        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // // 3. ambil harga produk
        $product = Product::find($request->product_id);

        // cek stok cukup
        if ($product->stock < $request->quantity) {
            return response()->json([
                "success" => false,
                "message" => "Stok tidak mencukupi"
            ], 400);
        }

        // perhitungan
        $totalPrice = $product->price * $request->quantity;

        // 4. insert data
        $order = Order::create([
            "user_id" => $request->user_id,
            "product_id" => $request->product_id,
            "quantity" => $request->quantity,
            "total_price" => $totalPrice,
            "address" => $request->address,
            "status" => "pending"
        ]);

        // kurangi stok produk
        $product->decrement('stock', $request->quantity);


        // 5. response
        return response()->json([
            'success' => true,
            'message' => 'Order added successfuly!',
            'data' => $order->load('product', 'user')
        ], 201);
    }

    // ambil salah satu produk
    public function show(string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "order not found!",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail order',
            'data' => $order->load('user', 'product')
        ], 200);
    }

    // update data
    public function update(string $id, Request $request)
    {
        // 1. mencari data
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "order not found"
            ], 404);
        }

        // 2. validator
        $validator = Validator::make($request->all(), [
            "user_id" => "required|exists:users,id",
            "product_id" => "required|exists:products,id",
            "quantity" => "required|integer|min:1",
            "address" => "required|string|max:255",
            "status" => "required|string|in:pending,approved",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // // 3. ambil harga produk
        $product = Product::find($request->product_id);

        // cek stok cukup
        if ($product->stock < $request->quantity) {
            return response()->json([
                "success" => false,
                "message" => "Stok tidak mencukupi"
            ], 400);
        }

        // perhitungan
        $totalPrice = $product->price * $request->quantity;

        // 4. insert data
        $order = Order::create([
            "user_id" => $request->user_id,
            "product_id" => $request->product_id,
            "quantity" => $request->quantity,
            "total_price" => $totalPrice,
            "address" => $request->address,
            "status" => $request->status,
        ]);

        // kurangi stok produk
        $product->decrement('stock', $request->quantity);

        // 5. response
        return response()->json([
            'success' => true,
            'message' => 'Order added successfuly!',
            'data' => $order->load('user', 'product')
        ], 201);
    }

    // delete data
    public function destroy(string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "order not found"
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted success'
        ]);
    }
}
