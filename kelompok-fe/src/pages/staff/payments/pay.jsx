import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createPayment } from "../../../_services/payments";

export default function PaymentCreate() {
   const { orderId } = useParams(); 

   const [formData, setFormData] = useState({
      method: "",
      proof: null,
   });

   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value, type, files } = e.target;


      if (type === "file") {
         setFormData((prev) => ({
            ...prev,
            [name]: files[0], 
         }));
      }

      else {
         setFormData((prev) => ({
            ...prev,
            [name]: value, 
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();


      if (!orderId) {
         alert("Order ID tidak ditemukan di URL. Tidak dapat melanjutkan.");
         return;
      }
      if (!formData.method) {
         alert("Pilih Metode Pembayaran.");
         return;
      }
      if (formData.method === "transfer" && !formData.proof) {
         alert("Metode Transfer memerlukan Bukti Pembayaran.");
         return;
      }

      try {

         const payload = new FormData();
         payload.append("method", formData.method);
         if (formData.proof) {
            payload.append("proof", formData.proof);
         }

         await createPayment(payload, orderId);

         alert(`Pembayaran untuk Order ID ${orderId} berhasil dikirim.`);
         navigate("/staff/payments");
      } catch (error) {
         console.error(error.response || error);
         const errorMessage =
            error.response?.data?.message || "Terjadi kesalahan server.";
         alert(`Error creating payments: ${errorMessage}`);
      }
   };

   return (
      <>
         <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
               <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Payment
               </h2>
               <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">

                     <div>
                        <label
                           htmlFor="payment_method_select"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Method
                        </label>
                        <select
                           id="payment_method_select"
                           name="method"
                           value={formData.method}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        >
                           <option value="">--select method--</option>
                           <option value="cod">Cash on Delivery (COD)</option>
                           <option value="transfer">Transfer Bank</option>
                        </select>
                     </div>


                     <div className="w-full">
                        <label
                           htmlFor="proof"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Upload Bukti
                        </label>
                        <input
                           type="file"
                           name="proof"
                           id="proof"
                           accept="image/*"
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                           required={formData.method === "transfer"}
                           disabled={formData.method !== "transfer"}
                        />
                     </div>


                     <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                           Order Id
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {orderId || "Loading..."}{" "}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <button
                        type="submit"
                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                     >
                        Pay
                     </button>
                  </div>
               </form>
            </div>
         </section>
      </>
   );
}
