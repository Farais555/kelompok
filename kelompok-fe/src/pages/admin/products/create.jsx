import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../_services/products";
import { useEffect, useState } from "react";

export default function ProductCreate() {
   const [currentUserInfo, setCurrentUserInfo] = useState({
      id: null,
      name: "Loading...",
   });

   const [formData, setFormData] = useState({
      name: "",
      photo_product: null,
      description: "",
      price: "0",
      stock: "0",
   });

   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
         const userInfoString = localStorage.getItem("userInfo");

         if (userInfoString) {
            try {
               const userInfo = JSON.parse(userInfoString);
               setCurrentUserInfo({ id: userInfo.id, name: userInfo.name });

               setFormData((info) => ({
                  ...info,
                  user_id: userInfo.id,
               }));
            } catch (e) {
               console.error("Failed to parse userInfo from localStorage:", e);
               setCurrentUserInfo({ id: null, name: "Error User Data" });
            }
         } else {
            setCurrentUserInfo({ id: null, name: "Login Required" });
         }
      };

      fetchData();
   }, []);

   const handleChange = (e) => {
      const { name, value, files } = e.target;

      if (name === "photo_product") {
         setFormData({
            ...formData,
            photo_product: files[0],
         });
      } else {
         setFormData({
            ...formData,
            [name]: value,
         });
      }
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

         await createProduct(payload);
         navigate("/admin/products");
      } catch (error) {
         console.log(error);
         alert("Error creating product");
      }
   };

   return (
      <>
         <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
               <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Create New Product
               </h2>
               <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                     <div className="sm:col-span-2">
                        <label
                           htmlFor="name"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Name
                        </label>
                        <input
                           type="text"
                           name="name"
                           id="name"
                           value={formData.name}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                           placeholder="e.g. donat"
                           required
                        />
                     </div>
                     
                     <div className="w-full">
                        <label
                           htmlFor="price"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Price
                        </label>
                        <input
                           type="number"
                           name="price"
                           id="price"
                           value={formData.price}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                           placeholder="e.g. 150000"
                           required
                        />
                     </div>
                     <div className="w-full">
                        <label
                           htmlFor="stock"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           stock
                        </label>
                        <input
                           type="number"
                           name="stock"
                           id="stock"
                           value={formData.stock}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                           placeholder="e.g. 150000"
                           required
                        />
                     </div>

                     <div className="w-full">
                        <label
                           htmlFor="photo_product"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Photo Product
                        </label>
                        <input
                           type="file"
                           name="photo_product"
                           id="photo_product"
                           accept="image/*"
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                           required
                        />
                     </div>

                     <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                           Petugas
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 p-2.5 bg-gray-100 rounded-lg">
                           {currentUserInfo.name.split(" ")[0]}
                        </p>
                        <input
                           type="hidden"
                           name="user_id"
                           value={formData.user_id}
                        />
                     </div>

                     <div className="sm:col-span-2">
                        <label
                           htmlFor="description"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Description
                        </label>
                        <textarea
                           id="description"
                           name="description"
                           value={formData.description}
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
                        Create Product
                     </button>
                     <button
                        type="reset"
                        className="text-gray-600 inline-flex items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                     >
                        Reset
                     </button>
                  </div>
               </form>
            </div>
         </section>
      </>
   );
}
