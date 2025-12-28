import { useEffect, useState } from "react";
import {
   fetchPayments,
   updatePaymentStatus,
} from "../../../_services/payments";
import { Link } from "react-router-dom";

export default function AdminPayments() {
   const [payments, setPayments] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);

   // 1. Fungsi Utama untuk memuat data
   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         // Kita hanya butuh fetchPayments karena di Backend sudah ada .with('order.user')
         const response = await fetchPayments(page);

         setPayments(response.data); // Array data payment
         setPagination(response); // Objek pagination lengkap (links, total, dll)
         setCurrentPage(page);
      } catch (error) {
         console.error("Gagal memuat data:", error);
      } finally {
         setLoading(false);
      }
   };

   // 2. Jalankan sekali saat komponen dimuat
   useEffect(() => {
      loadPages(1);
   }, []);

   const handleApprove = async (paymentId) => {
      if (!window.confirm(`Setujui pembayaran ID: ${paymentId}?`)) return;

      try {
         await updatePaymentStatus(paymentId, "paid");
         alert(`Pembayaran berhasil disetujui.`);

         // Refresh data pada halaman yang sama
         loadPages(currentPage);
      } catch (error) {
         const msg =
            error.response?.data?.message || "Gagal menyetujui pembayaran";
         alert(msg);
      }
   };

   const handlePageChange = (url) => {
      if (!url) return;
      const urlParams = new URLSearchParams(new URL(url).search);
      const page = urlParams.get("page");
      loadPages(page);
   };

   if (loading) {
      return <div className="p-4 text-center">Memuat data pembayaran...</div>;
   }

   return (
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
         <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                     <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Metode</th>
                        <th className="px-4 py-3">Bukti</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Disetujui Pada</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                     </tr>
                  </thead>
                  <tbody>
                     {payments.length > 0 ? (
                        payments.map((payment) => (
                           <tr
                              key={payment.id}
                              className="border-b dark:border-gray-700"
                           >
                              <th className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                                 {/* SOLUSI: Langsung akses payment.order.id */}
                                 {payment.order
                                    ? `#ORD-${payment.order.id}`
                                    : "N/A"}
                              </th>
                              <td className="px-4 py-3">
                                 {/* Menampilkan nama user dari relasi order.user */}
                                 {payment.order?.user?.name || "Guest"}
                              </td>
                              <td className="px-4 py-3">{payment.method}</td>
                              <td className="px-4 py-3">
                                 {payment.proof && (
                                    <a
                                       href={`http://localhost:8000/storage/${payment.proof}`}
                                       target="_blank"
                                       rel="noreferrer"
                                    >
                                       <img
                                          src={`http://localhost:8000/storage/${payment.proof}`}
                                          alt="Bukti Transfer"
                                          className="w-10 h-10 object-cover rounded border hover:scale-110 transition-transform"
                                       />
                                    </a>
                                 )}
                              </td>
                              <td className="px-4 py-3">
                                 <span
                                    className={`px-2 py-1 rounded text-xs ${
                                       payment.status === "paid"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }`}
                                 >
                                    {payment.status}
                                 </span>
                              </td>
                              <td className="px-4 py-3">
                                 {payment.paid_at || "-"}
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {payment.status !== "paid" && (
                                    <button
                                       onClick={() => handleApprove(payment.id)}
                                       className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-xs px-3 py-1.5"
                                    >
                                       Approve
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="6" className="text-center py-10">
                              Data tidak ditemukan
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination Navigation */}
            <nav className="flex flex-col md:flex-row justify-between items-center p-4 space-y-3 md:space-y-0">
               <span className="text-sm text-gray-500">
                  Showing{" "}
                  <b>
                     {pagination.from || 0}-{pagination.to || 0}
                  </b>{" "}
                  of <b>{pagination.total || 0}</b>
               </span>
               <ul className="inline-flex items-stretch -space-x-px">
                  {pagination.links?.map((link, index) => (
                     <li key={index}>
                        <button
                           onClick={() => handlePageChange(link.url)}
                           disabled={!link.url || link.active}
                           className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                              link.active
                                 ? "z-10 text-indigo-600 bg-indigo-50 border-indigo-300"
                                 : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100"
                           } ${
                              !link.url ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                           dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                     </li>
                  ))}
               </ul>
            </nav>
         </div>
      </section>
   );
}
