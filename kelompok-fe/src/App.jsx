import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffLayout from "./layouts/staff";
import Login from "./pages/auth/login";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin";
import AdminProducts from "./pages/admin/products";
import AdminUsers from "./pages/admin/users";
import StaffProducts from "./pages/staff/product";
import ProductCreate from "./pages/admin/products/create";
import ProductEdit from "./pages/admin/products/edit";
import UserEdit from "./pages/admin/users/edit";
import UserCreate from "./pages/admin/users/create";
import StaffDashboard from "./pages/staff";
import PublicLayout from "./layouts/public";
import Home from "./pages/public";

function App() {
   return (
      <>
         <BrowserRouter>
            <Routes>
               {/* default */}
               <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
               </Route>

               {/* auth */}
               <Route path="login" element={<Login />} />

               {/* admin */}
               <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />

                  <Route path="users">
                     <Route index element={<AdminUsers />} />
                     <Route path="create" element={<UserCreate />} />
                     <Route path="edit/:id" element={<UserEdit />} />
                  </Route>

                  <Route path="products">
                     <Route index element={<AdminProducts />} />
                     <Route path="create" element={<ProductCreate />} />
                     <Route path="edit/:id" element={<ProductEdit />} />
                  </Route>
               </Route>

               {/* staff */}
               <Route path="staff" element={<StaffLayout />}>
                  <Route index element={<StaffDashboard />} />

                  <Route path="products">
                     <Route index element={<StaffProducts />} />
                  </Route>
               </Route>
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
