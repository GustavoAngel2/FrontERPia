
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/ui/navBar";

const RootLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <>
            {!isLoginPage && <NavBar />}
            <Outlet />
        </>
    );
}

export default RootLayout;