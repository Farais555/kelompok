import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productImageStorage } from "../../../_api";
import { fetchProducts } from "../../../_services/products";

export default function StaffProducts() {
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
         console.error("Cannot load Stores:", error);
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

   if (loading) {
      return <div className="p-4">Memuat data pengguna...</div>;
   }

   return (
      <>
         <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
               <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-3">
                  {products.length > 0 ? (
                     products.map((product) => (
                        <div
                           key={product.id}
                           className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                           <div className="h-56 w-full">
                              <img
                                 className="mx-auto h-full"
                                 src={`${productImageStorage}/${product.photo_product}`}
                                 alt=""
                              />
                           </div>

                           <div className="pt-6">
                              <Link
                                 to="/staff/productions"
                                 className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                              >
                                 {product.name}
                              </Link>

                              <div className="mt-4 flex items-center justify-between gap-4">
                                 <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                    Rp. {product.price}
                                 </p>

                                 <Link
                                    to={`/staff/products/show/${product.id}`}
                                    className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4  focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                 >
                                    Beli
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p>No books found</p>
                  )}
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
