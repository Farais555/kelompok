import { useEffect, useState } from "react";
import {
   fetchPayments,
   getPayments,
   updatePaymentStatus,
} from "../../../_services/payments";
import { getOrders } from "../../../_services/orders";
import { Link } from "react-router-dom";

export default function AdminPayments() {
   const [payments, setPayments] = useState([]);
   const [orders, setOrders] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);

   // Fungsi untuk memuat data pembayaran
   const loadPayments = async () => {
      try {
         const paginator = await getPayments();
         setPayments(paginator.data);
      } catch (error) {
         console.error("Gagal memuat pembayaran:", error);
      }
   };

   useEffect(() => {
      loadPayments();
   }, []);

   const handleApprove = async (paymentId) => {
      if (
         !window.confirm(`Yakin ingin menyetujui pembayaran ID: ${paymentId}?`)
      )
         return;

      try {
         await updatePaymentStatus(paymentId, "paid");
         alert(`Pembayaran ID ${paymentId} berhasil disetujui.`);

         // Refresh data di halaman yang sama agar tidak kembali ke hal 1
         loadPages(currentPage);
      } catch (error) {
         const msg = error.response?.data?.message || "Server Error";
         alert(`Gagal menyetujui: ${msg}`);
      }
   };

   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         const paginator = await fetchPayments(page);
         const orderData = await getOrders();

         setPayments(paginator.data);
         // Pastikan jika getOrders juga ber-paginasi, ambil .data-nya
         setOrders(orderData.data || orderData);

         setPagination(paginator);
         setCurrentPage(page);
      } catch (error) {
         console.error("Cannot load data:", error);
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

   const getOrderId = (id) => {
      const order = orders.find((order) => order.id === id);
      return order ? order.id : "Unknown order";
   };

   if (loading) {
      return <div className="p-4">Memuat data pengguna...</div>;
   }

   return (
      <>
         <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
               <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"></div>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                           <th scope="col" className="px-4 py-3">
                              Order
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Metode
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Bukti
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Status
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Dibayar
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Disetujui
                           </th>
                           <th scope="col" className="px-4 py-3">
                              <span className="sr-only">Actions</span>
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {payments.length > 0 ? (
                           payments.map((payment) => (
                              <tr
                                 key={payment.id}
                                 className="border-b dark:border-gray-700"
                              >
                                 <th
                                    scope="row"
                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                 >
                                    {getOrderId(payment.order_id)}
                                 </th>
                                 <td className="px-4 py-3">{payment.method}</td>
                                 <td className="px-4 py-3 max-w-[150px] truncate">
                                    {payment.proof}
                                 </td>
                                 <td className="px-4 py-3">{payment.status}</td>
                                 <td className="px-4 py-3">
                                    {payment.paid_at}
                                 </td>
                                 <td className="px-4 py-3">
                                    {payment.confirmed_at}
                                 </td>
                                 <td className="px-4 py-3 flex items-center justify-end relative">
                                    <button
                                       onClick={() => handleApprove(payment.id)}
                                       type="button"
                                       className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                                    >
                                       Approve
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="99" className="text-center py-4">
                                 Data tidak ditemukan
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <nav
                  className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                  aria-label="Table navigation"
               >
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                     Showing
                     <span className="font-semibold text-gray-900 dark:text-white">
                        {" "}
                        {pagination.from || 0}-{pagination.to || 0}{" "}
                     </span>
                     of
                     <span className="font-semibold text-gray-900 dark:text-white">
                        {" "}
                        {pagination.total || 0}
                     </span>
                  </span>

                  <ul className="inline-flex items-stretch -space-x-px">
                     {pagination.links &&
                        pagination.links.map((link, index) => {
                           const isDisabled = link.url === null;

                           let label = link.label;

                           if (label.includes("Previous")) label = "Previous";
                           if (label.includes("Next")) label = "Next";

                           return (
                              <li key={index}>
                                 <button
                                    onClick={() => handlePageChange(link.url)}
                                    disabled={isDisabled}
                                    className={`
                            flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 dark:border-gray-700
                            ${
                               link.active
                                  ? "z-10 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-gray-700 dark:text-white"
                                  : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            } 
                            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                            ${index === 0 ? "rounded-l-lg" : ""}
                            ${
                               index === pagination.links.length - 1
                                  ? "rounded-r-lg"
                                  : ""
                            }
                        `}
                                    dangerouslySetInnerHTML={{ __html: label }}
                                 />
                              </li>
                           );
                        })}
                  </ul>
               </nav>
            </div>
         </section>
      </>
   );
}
