<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    //tampilkan semua produk
    public function index() {
        $product = Product::paginate(5);

        return response()->json([
            "success" => true,
            "message" => "Get all Product",
            "data" => $product
        ], 200);
    }

    // tambah data
    public function store(Request $request) {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'photo_product' => 'required|image|mimes:jpeg,jpg,png|max:4096',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:10'
        ]);

        // 2. cek validator error
        if($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // 3. upload image
        $image = $request->file('photo_product');
        $image->store('products', 'public');

        // 4. insert data
        $product = Product::create([
            'name' => $request->name,
            'photo_product' => $image->hashName(),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock
        ]);

        // 5. response
        return response()->json([
            'success' => true,
            'message' => 'Product added successfuly!',
            'data' => $product
        ], 201);
    }

    // ambil salah satu produk
    public function show(string $id) {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => "Product not found!",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail product',
            'data' => $product
        ], 200);
    }

    // update data
    public function update(string $id, Request $request) {
        // 1. mencari data
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => "Product not found"
            ], 404);
        }

        // 2. validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'photo_product' => 'nullable|image|mimes:jpeg,jpg,png|max:4096',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:10'
        ]);

        if($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // 3. siapkan data yang ingin diupdate
        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price
        ];

        // 4. handle image
        if ($request->hasFile('photo_product')) {
            $image = $request->file('photo_product');
            $image->store('products', 'public');

            if ($product->photo_product) {
                Storage::disk('public')->delete('products/' . $product->photo_product);
            }

            $data['photo_product'] = $image->hashName();
        }

        // 5. update data baru ke database
        $product->update($data);

        // response saat data berhasil dirubah
        return response()->json([
            'success' => true,
            'message' => 'Product update successfully',
            'data' => $product
        ], 200);
    }

    // delete data
    public function destroy(string $id) {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => "product not found"
            ], 404);
        }

        if ($product->photo_product) {
            // delete dari storage
            Storage::disk('public')->delete('products/' . $product->photo_product);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted success'
        ]);
    }

}
