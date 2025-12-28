import { useEffect, useState } from "react";
import { fetchOrders } from "../../../_services/orders";
import { getUsers } from "../../../_services/auth";
import { getProducts } from "../../../_services/products";
import { Link } from "react-router-dom";

export default function StaffOrders() {
   const [orders, setOrders] = useState([]);
   const [users, setUsers] = useState([]);
   const [products, setProducts] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);

   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         const pagination = await fetchOrders(page);
         const user = await getUsers();
         const product = await getProducts();

         setOrders(pagination.data);
         setUsers(user.data);
         setProducts(product.data);

         setPagination(pagination);
      } catch (error) {
         console.error("Cannot load order:", error);
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

   const getProductName = (id) => {
      const product = products.find((product) => product.id === id);
      return product ? product.name : "Unknown product";
   };

   const getUserName = (id) => {
      const user = users.find((user) => user.id === id);
      return user ? user.name.split(" ")[0] : "Unknown user";
   };

   const formatRupiah = (number) => {
      return `Rp. ${Number(number).toLocaleString("id-ID")}`;
   };

   // const handleDelete = async (id) => {
   //    const confirmDelete = window.confirm(
   //       "Are you sure to delete this content?"
   //    );

   //    if (confirmDelete) {
   //       try {
   //          await deleteOrder(id);

   //          await loadPages(pagination.current_page);
   //       } catch (error) {
   //          console.error("Gagal menghapus order:", error);
   //          alert("Gagal menghapus data.");
   //       }
   //    }
   // };

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
                           <th scope="col" className="px-3 py-2">
                              User
                           </th>
                           <th scope="col" className="px-3 py-2">
                              Product
                           </th>
                           <th scope="col" className="px-1 py-2">
                              Quantity
                           </th>
                           <th scope="col" className="px-3 py-2">
                              Subtotal
                           </th>
                           <th scope="col" className="px-3 py-2">
                              Address
                           </th>
                           <th scope="col" className="px-3 py-2">
                              Phone
                           </th>
                           <th scope="col" className="px-3 py-2">
                              Status
                           </th>
                           <th scope="col" className="px-4 py-3">
                              <span className="sr-only">Actions</span>
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {orders.length > 0 ? (
                           orders.map((order) => (
                              <tr
                                 key={order.id}
                                 className="border-b dark:border-gray-700"
                              >
                                 <th
                                    scope="row"
                                    className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                 >
                                    {getUserName(order.user_id)}
                                 </th>
                                 <td className="px-3 py-2">
                                    {getProductName(order.product_id)}
                                 </td>
                                 <td className="px-1 py-2 max-w-[150px] truncate">
                                    {order.quantity}
                                 </td>
                                 <td className="px-3 py-2">
                                    {formatRupiah(order.total_price)}
                                 </td>
                                 <td className="px-3 py-2">{order.address}</td>
                                 <td className="px-3 py-2">{order.phone}</td>
                                 <td className="px-4 py-3">
                                    <span
                                       className={`px-2 py-1 rounded text-xs ${
                                          order.status === "approved"
                                             ? "bg-green-100 text-green-800"
                                             : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {order.status}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 flex items-center justify-end relative">
                                    <Link
                                       to={`/staff/payments/pay/${order.id}`}
                                       type="button"
                                       className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                                    >
                                       Bayar
                                    </Link>
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
