import { Outlet } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function PublicLayout() {
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-100px)]">
            <Outlet />
            <Footer />
            </div>
        </>
    )
}