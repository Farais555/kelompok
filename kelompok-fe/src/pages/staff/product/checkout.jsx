import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder } from "../../../_services/orders";

export default function OrderCreate() {
   const location = useLocation();
   const transactionData = location.state;

   const [currentUserInfo, setCurrentUserInfo] = useState({
      id: null,
      name: "Loading...",
   });

   const [formData, setFormData] = useState({
      user_id: "",
      product_id: "",
      quantity: "",
      address: "",
   });

   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
         const userInfoString = localStorage.getItem("userInfo");

         // 🚨 1. VALIDASI DATA TRANSAKSI
         if (!transactionData || !transactionData.product_id) {
            alert("Data produk tidak valid. Kembali ke halaman produk.");
            navigate("/staff/products");
            return;
         }

         // 2. Ambil User Info dari Local Storage
         let userId = "";
         if (userInfoString) {
            try {
               const userInfo = JSON.parse(userInfoString);
               setCurrentUserInfo({ id: userInfo.id, name: userInfo.name });
               userId = userInfo.id;
            } catch (e) {
               console.error("Failed to parse userInfo from localStorage:", e);
               setCurrentUserInfo({ id: null, name: "Error User Data" });
            }
         } else {
            setCurrentUserInfo({ id: null, name: "Login Required" });
         }

         // 🚨 3. SET formData AWAL (Gabungkan data user dan data transaksi)
         setFormData((info) => ({
            ...info,
            user_id: userId,
            product_id: transactionData.product_id, // 👈 DIISI DARI location.state
            quantity: transactionData.quantity, // 👈 DIISI DARI location.state
         }));
      };

      fetchData();

      // Tambahkan transactionData ke dependency array agar effect berjalan jika data berubah
      // (Walaupun state biasanya hanya diset sekali saat navigasi)
   }, [navigate, transactionData]);

   const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.user_id) {
         alert(
            "Petugas belum teridentifikasi. Coba muat ulang halaman atau login kembali."
         );
         return;
      }

      try {
         const payload = new FormData();
         for (const key in formData) {
            payload.append(key, formData[key]);
         }

         await createOrder(payload);
         navigate("/staff/products");
      } catch (error) {
         console.log(error);
         alert("Error creating order");
      }
   };

   return (
      <>
         <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
               <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Selesaikan Order
               </h2>
               <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                     <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                           Nama
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {currentUserInfo.name}
                        </p>
                        <input
                           type="hidden"
                           name="user_id"
                           value={formData.user_id}
                        />
                     </div>
                     <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                           Product
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {transactionData?.product_name}
                        </p>
                        <input
                           type="hidden"
                           name="product_id"
                           value={transactionData?.product_id}
                        />
                     </div>

                     <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                           Harga satuan
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {transactionData?.product_price}
                        </p>
                        <input type="hidden" name="product_price" value="" />
                     </div>

                     <div className="w-full">
                        <label
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Jumlah Pembelian
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {transactionData?.quantity}
                        </p>
                        <input
                           type="hidden"
                           name="quantity"
                           value={transactionData?.quantity}
                        />
                     </div>

                     <div className="w-full">
                        <label
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Total
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {transactionData?.total_price}
                        </p>
                        <input
                           type="hidden"
                           name="total_price"
                           value=""
                        />
                     </div>

                     <div className="sm:col-span-2">
                        <label
                           htmlFor="address"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Alamat
                        </label>
                        <textarea
                           id="address"
                           name="address"
                           value={formData.address}
                           onChange={handleChange}
                           rows="6"
                           className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                           placeholder="Write a description of the book here..."
                        ></textarea>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <button
                        type="submit"
                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                     >
                        Create Order
                     </button>
                     <Link to={`/staff/products}`}
                        type="button"
                        className="text-gray-600 inline-flex items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                     >
                        Back
                     </Link>
                  </div>
               </form>
            </div>
         </section>
      </>
   );
}
