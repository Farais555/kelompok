import {  useNavigate, useParams } from "react-router-dom";
import {  useState } from "react";
import { confirmPayment } from "../../../_services/payments";


export default function PaymentCreate() {
   const { orderId } = useParams();
    const navigate = useNavigate();
    
    const [method, setMethod] = useState('');
    const [proofFile, setProofFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Handlers ---
    
    const handleFileChange = (e) => {
        // Ambil file pertama yang dipilih
        setProofFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!method) {
            setError('Pilih metode pembayaran terlebih dahulu.');
            setIsLoading(false);
            return;
        }

        // 1. Buat Objek FormData
        const formData = new FormData();
        formData.append('method', method);

        // 2. Tambahkan Bukti Pembayaran (jika metode adalah transfer)
        if (method === 'transfer') {
            if (!proofFile) {
                setError('Bukti pembayaran wajib diunggah untuk metode Transfer.');
                setIsLoading(false);
                return;
            }
            formData.append('proof', proofFile);
        }

        // 3. Kirim ke Backend
        try {
            await confirmPayment(orderId, formData);
            
            // Tentukan pesan sukses berdasarkan metode
            const successMessage = method === 'cod' 
                ? `Order #${orderId} berhasil dibuat dengan COD. Status: PAID.` 
                : `Bukti transfer Order #${orderId} berhasil diunggah. Menunggu verifikasi Admin.`;
            
            alert(successMessage);
            
            // 4. Redirect ke halaman order detail atau order list
            navigate(`/staff/orders/${orderId}`); 

        } catch (err) {
            console.error(err);
            // Tangani error validasi 422 dari Laravel
            const errorMsg = err.response?.data?.message || 'Gagal menyimpan pembayaran.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Pilih Pembayaran Order #{orderId}</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Metode Pembayaran</label>
                    <select
                        value={method}
                        onChange={(e) => {
                            setMethod(e.target.value);
                            setProofFile(null); // Reset file saat metode ganti
                        }}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Pilih Metode</option>
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="transfer">Transfer Bank</option>
                    </select>
                </div>

                {/* 🚨 Field Bukti Pembayaran hanya muncul untuk Transfer */}
                {method === 'transfer' && (
                    <div className="mb-4">
                        <label htmlFor="proof" className="block text-sm font-medium mb-2">
                            Unggah Bukti Transfer (JPG/PNG)
                        </label>
                        <input
                            type="file"
                            id="proof"
                            name="proof"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-2 rounded disabled:bg-indigo-400"
                >
                    {isLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                </button>
            </form>
        </div>
    );
}
