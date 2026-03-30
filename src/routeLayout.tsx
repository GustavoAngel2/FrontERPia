
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/ui/navBar";
import ChatBot from "./components/ui/ChatBot";

const RootLayout = () => {
    const location = useLocation();
    const normalizedPath = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    const isLoginPage = normalizedPath === "/login" || normalizedPath.startsWith("/login/");

    return (
        <>
            {!isLoginPage && <NavBar />}
            <Outlet />
            <ChatBot variant="floating" />
        </>
    );
}

export default RootLayout;