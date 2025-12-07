import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, useDecodeToken } from "../_services/auth";
import { useEffect, useState } from "react";

export default function AdminLayout() {
   const navigate = useNavigate();
   const token = localStorage.getItem("accessToken");
   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
   const decodedData = useDecodeToken(token);

   const [sideBarOpen, setSideBarOpen] = useState(false);

   useEffect(() => {
      // Jika ada forceLogout, clear dan berhenti
      if (localStorage.getItem("forceLogout") === "1") {
         localStorage.removeItem("forceLogout");
         return;
      }

      if (!token) {
         navigate("/");
         return;
      }

      // Tunggu decode selesai → jangan redirect!
      if (decodedData.loading) return;

      // Jika token invalid / expired
      if (decodedData.success === false) {
         localStorage.removeItem("accessToken");
         localStorage.removeItem("userInfo");
         navigate("/");
         return;
      }

      // Jika token valid tetapi role bukan admin
      if (userInfo.role !== "admin") {
         navigate("/staff");
         return;
      }
   }, [token, decodedData, userInfo, navigate]);

   const handleLogout = async () => {
      if (token) {
         await logout({ token });
         localStorage.removeItem("userInfo");
         navigate("/");
      }
   };

   return (
      <>
         <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
               <div className="flex flex-wrap justify-between items-center">
                  <div className="flex justify-start items-center">
                     <button
                        onClick={() => setSideBarOpen(!sideBarOpen)}
                        className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                     >
                        <svg
                           aria-hidden="true"
                           className="w-6 h-6"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              fillRule="evenodd"
                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                           ></path>
                        </svg>
                        <svg
                           aria-hidden="true"
                           className="hidden w-6 h-6"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                           ></path>
                        </svg>
                        <span className="sr-only">Toggle sidebar</span>
                     </button>
                     <a
                        href=""
                        className="flex items-center justify-between mr-4"
                     >
                        {/* <img
                           src=""
                           className="mr-3 h-8"
                           alt="Flowbite Logo"
                        /> */}
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                           Gas2galon
                        </span>
                     </a>
                  </div>
                  <div className="flex items-center lg:order-2 gap-5">
                     <div>
                        <span>Hi, {token && userInfo?.name.split(" ")[0]}</span>
                     </div>
                     <Link
                        to={"/admin"}
                        className="text-white bg-indigo-500 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                     >
                        {token && userInfo?.role === "admin"
                           ? "Admin"
                           : "Pengguna"}
                     </Link>
                  </div>
               </div>
            </nav>

            {/* <!-- Sidebar --> */}

            <aside
               className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${
                  sideBarOpen ? "translate-x-0" : "-translate-x-full"
               } bg-white dark:bg-gray-800 md:translate-x-0`}
               aria-label="Sidebar"
            >
               <div className="h-full flex flex-col justify-between py-5 px-3 bg-white dark:bg-gray-800">
                  <ul className="space-y-2">
                     <li>
                        <Link
                           to={"/admin"}
                           className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                           <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                           </svg>
                           <span className="ml-3">Overview</span>
                        </Link>
                     </li>
                     <li>
                        <Link
                           to={"/admin/users"}
                           className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                           <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                                 clipRule="evenodd"
                              />
                           </svg>

                           <span className="ml-3">Users</span>
                        </Link>
                     </li>
                     <li>
                        <Link
                           to={"/admin/products"}
                           className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                           <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 fill="currentColor"
                                 d="M9.98189 4.50602c1.24881-.67469 2.78741-.67469 4.03621 0l3.9638 2.14148c.3634.19632.6862.44109.9612.72273l-6.9288 3.60207L5.20654 7.225c.2403-.22108.51215-.41573.81157-.5775l3.96378-2.14148ZM4.16678 8.84364C4.05757 9.18783 4 9.5493 4 9.91844v4.28296c0 1.3494.7693 2.5963 2.01811 3.2709l3.96378 2.1415c.32051.1732.66011.3019 1.00901.3862v-7.4L4.16678 8.84364ZM13.009 20c.3489-.0843.6886-.213 1.0091-.3862l3.9638-2.1415C19.2307 16.7977 20 15.5508 20 14.2014V9.91844c0-.30001-.038-.59496-.1109-.87967L13.009 12.6155V20Z"
                              />
                           </svg>

                           <span className="ml-3">Product</span>
                        </Link>
                     </li>
                     <li>
                        <Link
                           to={"/admin/orders"}
                           className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                           <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              fill="none"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 stroke="currentColor"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z"
                              />
                           </svg>

                           <span className="ml-3">Order</span>
                        </Link>
                     </li>
                     <li>
                        <Link
                           to={"/admin/payments"}
                           className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                           <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              fill="none"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 stroke="currentColor"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18"
                              />
                           </svg>

                           <span className="ml-3">Payment</span>
                        </Link>
                     </li>
                  </ul>
                  <button
                     onClick={handleLogout}
                     className="bg-red-600 text-white p-2 rounded-lg text-center w-full hover:bg-red-900"
                  >
                     <span>Log out</span>
                  </button>
               </div>
            </aside>

            <main className="p-4 md:ml-64 h-auto pt-20">
               <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-auto px-4 pt-4 pb-6">
                  <Outlet />
               </div>
            </main>
         </div>
      </>
   );
}
