import { useState } from "react";
import { createUser } from "../../../_services/user";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "",
      confirmPassword: "",
   });

   const [error, setError] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
         setError("Invalid email");
         return;
      }

      if (formData.password !== formData.confirmPassword) {
         setError("Password does not match!");
         return;
      }

      try {
         const payload = new FormData();
         for (const key in formData) {
            payload.append(key, formData[key]);
         }

         await createUser(payload);
         navigate("/admin/users");
      } catch (error) {
         console.log(error);
         alert("Error creating user");
      }

   };

   return (
      <>
         <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
               <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Create User
               </h2>

               {error && <p className="text-red-500 text-sm">{error}</p>}
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
                           placeholder="Woko Jidodo"
                           required
                        />
                     </div>
                     <div className="w-full">
                        <label
                           htmlFor="email"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           email
                        </label>
                        <input
                           type="text"
                           name="email"
                           id="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                           placeholder="example@company.com"
                           required
                        />
                     </div>

                     <div>
                        <label
                           htmlFor="role"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                           Role
                        </label>
                        <select
                           id="role"
                           name="role"
                           value={formData.role}
                           onChange={handleChange}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        >
                           <option value="">--select role--</option>
                           <option value="admin">Admin</option>
                           <option value="staff">Pengguna</option>
                        </select>
                     </div>

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
                        Create
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
