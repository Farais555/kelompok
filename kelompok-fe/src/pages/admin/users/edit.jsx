import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showUser, updateUser } from "../../../_services/user";

export default function UserEdit() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
      _method: "PUT",
   });

   useEffect(() => {
      const fetchData = async () => {
         const [userData] = await Promise.all([showUser(id)]);

         setFormData({
            password: userData.password,
            _method: "PUT",
         });
      };

      fetchData();
   }, [id]);

   const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const [error, setError] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
         setError("Password does not match!");
         return;
      }

      try {
         const payload = {
            password: formData.password,
            _method: formData._method,
         };

         await updateUser(id, payload);
         navigate("/admin/users");
      } catch (error) {
         console.log(error);
         alert("Error change password");
      }
   };

   return (
      <>
         <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
               <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Change Password
               </h2>
               {error && <p className="text-red-500 text-sm">{error}</p>}
               <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                     <div className="sm:col-span-2">
                        <label
                           htmlFor="password"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Password
                        </label>
                        <input
                           type="password"
                           name="password"
                           id="password"
                           value={formData.password}
                           onChange={handleChange}
                           placeholder="••••••••"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required
                        />
                     </div>
                     
                     <div className="sm:col-span-2">
                        <label
                           htmlFor="confirmPassword"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Confirm Password
                        </label>
                        <input
                           type="password"
                           name="confirmPassword"
                           id="confirmPassword"
                           value={formData.confirmPassword}
                           onChange={handleChange}
                           placeholder="••••••••"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required
                        />
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <button
                        type="submit"
                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                     >
                        save
                     </button>
                  </div>
               </form>
            </div>
         </section>
      </>
   );
}
