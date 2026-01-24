import NavBar from "../../ui/navBar"
import { useAuth } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

function RecetasView() {
    const navigate = useNavigate();
    const { isLogged, user } = useAuth();

    if (!isLogged){
        navigate("/")
    }
    
    return (
        <>
            <NavBar/>
            <h1>Test</h1>
        </>
    );
}

export default RecetasView;