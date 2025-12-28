import { useEffect, useState } from "react";
import { deletePayment, fetchPayments } from "../../../_services/payments";
import { Link } from "react-router-dom";

export default function StaffPayments() {
   const [payments, setPayments] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1); // Tambahkan ini
   const [openDropdownId, setOpenDropdownId] = useState(null);

   // 1. Load Data
   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         // Backend sudah me-load .with('order.user')
         const response = await fetchPayments(page);

         setPayments(response.data);
         setPagination(response);
         setCurrentPage(page);
      } catch (error) {
         console.error("Gagal memuat data:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadPages(1);
   }, []);

   const handlePageChange = (url) => {
      if (!url) return;
      const urlParams = new URLSearchParams(new URL(url).search);
      const page = urlParams.get("page");
      loadPages(page);
   };

   const toggleDropdown = (id) => {
      setOpenDropdownId(openDropdownId === id ? null : id);
   };

   const handleDelete = async (id) => {
      if (
         !window.confirm(
            "Apakah Anda yakin ingin menghapus data pembayaran ini?"
         )
      )
         return;

      try {
         await deletePayment(id);
         alert("Data berhasil dihapus");
         // Refresh ke halaman aktif saat ini
         loadPages(currentPage);
      } catch (error) {
         console.error("Gagal menghapus payment:", error);
         alert("Gagal menghapus data. Pembayaran mungkin sudah disetujui.");
      }
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
                        <th className="px-4 py-3">Metode</th>
                        <th className="px-4 py-3">Bukti</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Disetujui</th>
                        {/* <th className="px-4 py-3 text-right">Aksi</th> */}
                     </tr>
                  </thead>
                  <tbody>
                     {payments.length > 0 ? (
                        payments.map((payment) => (
                           <tr
                              key={payment.id}
                              className="border-b dark:border-gray-700"
                           >
                              <th className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                 {/* LANGSUNG AMBIL DARI RELASI */}
                                 {payment.order
                                    ? `#ORD-${payment.order.id}`
                                    : "N/A"}
                              </th>
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
                                    className={`px-2 py-0.5 rounded-full text-xs ${
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
                              <td className="px-4 py-3 text-right relative">
                                 <button
                                    onClick={() => toggleDropdown(payment.id)}
                                    className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100"
                                    type="button"
                                 >
                                    <svg
                                       className="w-5 h-5"
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                    >
                                       <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                 </button>

                                 {openDropdownId === payment.id && (
                                    <div className="absolute right-0 z-20 w-32 bg-white rounded shadow-lg border dark:bg-gray-700 dark:border-gray-600">
                                       <ul className="py-1 text-sm text-left">
                                          <li>
                                             <Link
                                                to={`/staff/payments/edit/${payment.id}`}
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                             >
                                                Edit
                                             </Link>
                                          </li>
                                          <li>
                                             <button
                                                onClick={() =>
                                                   handleDelete(payment.id)
                                                }
                                                className="block w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                             >
                                                Delete
                                             </button>
                                          </li>
                                       </ul>
                                    </div>
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

            {/* Pagination */}
            <nav className="flex flex-col md:flex-row justify-between items-center p-4">
               <span className="text-sm text-gray-500">
                  Showing{" "}
                  <b>
                     {pagination.from || 0}-{pagination.to || 0}
                  </b>{" "}
                  of <b>{pagination.total || 0}</b>
               </span>
               <ul className="inline-flex -space-x-px">
                  {pagination.links?.map((link, index) => (
                     <li key={index}>
                        <button
                           onClick={() => handlePageChange(link.url)}
                           disabled={!link.url}
                           className={`px-3 py-2 text-sm border ${
                              link.active
                                 ? "bg-indigo-50 text-indigo-600"
                                 : "bg-white text-gray-500"
                           } ${!link.url ? "opacity-50" : "hover:bg-gray-100"}`}
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
