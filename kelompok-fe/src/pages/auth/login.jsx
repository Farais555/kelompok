import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, useDecodeToken } from "../../_services/auth";
import Footer from "../../components/footer";

export default function Login() {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   const token = localStorage.getItem("accessToken");
   const decodedData = useDecodeToken(token);

   const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
         const response = await login(formData);

         localStorage.setItem("accessToken", response.token);
         localStorage.setItem("userInfo", JSON.stringify(response.user));

         return navigate(response.user.role === "admin" ? "/admin" : "/staff");
      } catch (error) {
         setError(error?.response?.data?.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {

   if (localStorage.getItem("forceLogout") === "1") {
      localStorage.removeItem("forceLogout");
   }

   if (!token) return;

   // Jangan redirect saat masih decoding
   if (decodedData.loading) return;

   if (decodedData.success === true) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      navigate(user.role === "admin" ? "/admin" : "/staff");
   }

}, [token, decodedData, navigate]);

   return (
      <>
         <section className="min-h-screen flex items-center justify-center bg-[url('/src/pages/auth/ilustrasi-matahari-terbit_169.jpeg')] dark:bg-[url('/src/pages/auth/malam.jpg')] bg-cover bg-no-repeat bg-center">
            <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg py-10">
               <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-1 dark:bg-gray-800">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                     <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                     </h1>

                     {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                     )}

                     <form
                        onSubmit={handleSubmit}
                        className="space-y-4 md:space-y-6"
                        action="#"
                     >
                        <div>
                           <label
                              htmlFor="email"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                           >
                              Your email
                           </label>
                           <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="name@company.com"
                              required
                           />
                        </div>
                        <div>
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
                        <button
                           type="submit"
                           className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        >
                           {loading ? "loading..." : "Sign In"}
                        </button>
                        {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                           Belum punya akun?{" "}
                           <Link
                              to="/"
                              className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                           >
                              Hubungi Dev untuk
                           </Link>
                        </p> */}
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}
