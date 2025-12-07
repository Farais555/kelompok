import { useEffect, useState } from "react";
import { deleteProduct, fetchProducts } from "../../../_services/products";
import { Link } from "react-router-dom";

export default function AdminProducts() {
   const [products, setProducts] = useState([]);
   const [pagination, setPagination] = useState({});
   const [loading, setLoading] = useState(true);

   const loadPages = async (page = 1) => {
      setLoading(true);
      try {
         const pagination = await fetchProducts(page);

         setProducts(pagination.data);

         setPagination(pagination);
      } catch (error) {
         console.error("Cannot load Product:", error);
      } finally {
         setLoading(false);
      }
   };

   const [openDropdownId, setOpenDropdownId] = useState(null);

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
            await deleteProduct(id);

            await loadPages(pagination.current_page);
         } catch (error) {
            console.error("Gagal menghapus Store:", error);
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
               <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                     <Link
                        to={`/admin/products/create`}
                        type="button"
                        className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                     >
                        <svg
                           className="h-3.5 w-3.5 mr-2"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                           aria-hidden="true"
                        >
                           <path
                              clipRule="evenodd"
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                           />
                        </svg>
                        Add product
                     </Link>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                           <th scope="col" className="px-4 py-3">
                              Product name
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Photo Product
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Description
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Price
                           </th>
                           <th scope="col" className="px-4 py-3">
                              Stock
                           </th>
                           <th scope="col" className="px-4 py-3">
                              <span className="sr-only">Actions</span>
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {products.length > 0 ? (
                           products.map((product) => (
                              <tr
                                 key={product.id}
                                 className="border-b dark:border-gray-700"
                              >
                                 <th
                                    scope="row"
                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                 >
                                    {product.name}
                                 </th>
                                 <td className="px-4 py-3">
                                    {product.photo_product}
                                 </td>
                                 <td className="px-4 py-3">
                                    {product.description}
                                 </td>
                                 <td className="px-4 py-3">{product.price}</td>
                                 <td className="px-4 py-3">{product.stock}</td>
                                 <td className="px-4 py-3 flex items-center justify-end relative">
                                    <button
                                       id={`dropdown-button-${product.id}`}
                                       onClick={() =>
                                          toggleDropdown(product.id)
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
                                    {openDropdownId === product.id && (
                                       <div
                                          id="apple-imac-27-dropdown"
                                          className="absolute right-0 mt-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                          style={{ top: "100%", right: "0" }}
                                       >
                                          <ul
                                             className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                             aria-labelledby={`dropdown-button-${product.id}`}
                                          >
                                             <li>
                                                <Link
                                                   to={`/admin/products/edit/${product.id}`}
                                                   className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                   Edit
                                                </Link>
                                             </li>
                                          </ul>
                                          <div className="py-1">
                                             <button
                                                onClick={() =>
                                                   handleDelete(product.id)
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
