<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    //tampilkan semua data user
    public function index()
    {
        $user = User::paginate(5);

        return response()->json([
            "success" => true,
            "message" => "Get all User",
            "data" => $user
        ], 200);
    }

    // tambah data
    public function store(Request $request)
    {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|string|in:admin,staff'
        ]);

        // 2. cek validator error
        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // 4. insert data
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role
        ]);

        // 4. cek keberhasilan
        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        }

        // 5. cek gagal
        return response()->json([
            'success' => false,
            'message' => 'User creation failed',
        ], 409); //Conflict
    }

    // ambil salah satu user
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => "User not found!",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail User',
            'data' => $user
        ], 200);
    }

    // update data password
    public function update(string $id, Request $request)
    {
        // 1. mencari data
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => "User not found"
            ], 404);
        }

        // 2. validator
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        // 3. siapkan data yang ingin diupdate
        $data = [
            'password' => bcrypt($request->password)
        ];

        // 5. update data baru ke database
        $user->update($data);

        // response saat data berhasil dirubah
        return response()->json([
            'success' => true,
            'message' => 'User update password successfully',
            'data' => $user
        ], 200);
    }

    // delete data
    public function destroy(string $id)
    {
        $authUser = auth('api')->user();
        $user = User::find($id);

        // Jika user yang ingin dihapus tidak ditemukan
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => "User not found"
            ], 404);
        }

        // Jika ADMIN mencoba menghapus dirinya sendiri → larang
        if ($authUser->role === 'admin' && $authUser->id == $id) {
            return response()->json([
                'success' => false,
                'message' => "Admin cannot delete themselves"
            ], 403);
        }

        // Jika bukan admin atau admin ingin hapus user lain → boleh
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "User deleted successfully"
        ], 200);
    }
}
