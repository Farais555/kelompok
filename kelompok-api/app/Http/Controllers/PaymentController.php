<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    //tampilkan semua order
    public function index()
    {
        $payment = Payment::with('order.user')->paginate(5);

        return response()->json([
            "success" => true,
            "message" => "Get all Payment",
            "data" => $payment
        ], 200);
    }

    // tambah data
    public function store(Request $request)
    {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'method' => 'required|in:cod,transfer',
            'proof' => 'required_if:method,transfer|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        // 2. cek validator error
        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        $image = null;
        if ($request->hasFile('proof')) {
            $image = $request->file('proof')->store('payments', 'public');
        }

        // 4. insert data
        $payment = Payment::create([
            'method' => $request->method,
            'proof' => $image,
            'status' => 'paid'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment method submitted',
            'data'    => $payment
        ], 201);
    }


    // ambil salah satu produk
    public function show(string $id)
    {
        $payment = Payment::with('order.user')->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => "payment not found!",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail payment',
            'data' => $payment
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:unpaid,paid,failed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        //  metode ( transfer) harus ada bukti sebelum bisa jadi paid
        if ($payment->method === 'transfer' && !$payment->proof && $request->status === 'paid') {
            return response()->json(['success' => false, 'message' => 'Bukti transfer belum ada'], 400);
        }

        $payment->update([
            'status'  => $request->status,
            'paid_at' => $request->status === 'paid' ? now() : null
        ]);

        // update order juga
        if ($request->status === 'paid') {
            $payment->order->update(['status' => 'approved']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data'    => $payment->load('order')
        ]);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully'
        ]);
    }
}
