import { useEffect, useState } from "react";
import { deletePayment, fetchPayments } from "../../../_services/payments";
import { Link } from "react-router-dom";

export default function StaffPayments() {
   const [payments, setPayments] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);

   const [openDropdownId, setOpenDropdownId] = useState(null);

   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         const pagination = await fetchPayments(page);

         setPayments(pagination.data);

         setPagination(pagination);
      } catch (error) {
         console.error("Cannot load incomes:", error);
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
      const confirmDelete = window.confirm(
         "Are you sure to delete this content?"
      );

      if (confirmDelete) {
         try {
            await deletePayment(id);

            await loadPages(pagination.current_page);
         } catch (error) {
            console.error("Gagal menghapus payment:", error);
            alert("Gagal menghapus data.");
         }
      }
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
                                 
                                 <td className="px-4 py-3">{payment.method}</td>
                                 <td className="px-4 py-3 max-w-[150px] truncate">
                                    {payment.proof}
                                 </td>
                                 <td className="px-4 py-3">{payment.status}</td>
                                 <td className="px-4 py-3 flex items-center justify-end relative">
                                    <button
                                       id={`dropdown-button-${payment.id}`}
                                       onClick={() =>
                                          toggleDropdown(payment.id)
                                       }
                                       className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                       type="button"
                                    >
                                       <svg
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                       </svg>
                                    </button>
                                    {openDropdownId === payment.id && (
                                       <div
                                          id="apple-imac-27-dropdown"
                                          className="absolute right-0 mt-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                          style={{ top: "100%", right: "0" }}
                                       >
                                          <ul
                                             className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                             aria-labelledby={`dropdown-button-${payment.id}`}
                                          >
                                             <li>
                                                <Link
                                                   to={`/staff/payments/edit/${payment.id}`}
                                                   className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                   Edit
                                                </Link>
                                             </li>
                                          </ul>
                                          <div className="py-1">
                                             <button
                                                onClick={() =>
                                                   handleDelete(payment.id)
                                                }
                                                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                             >
                                                Delete
                                             </button>
                                          </div>
                                       </div>
                                    )}
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
