import { Route, Routes, useNavigate } from "react-router-dom";
import Callback from "./Callback";
import Auth from "../auth/auth";



const Login = () => {

    const redirect = () => {
        window.location.href = Auth.GetLoginUrl()
    }

    return (
        <div>
            <Routes>
                <Route path="/callback" element={<Callback />}/>
            </Routes>
                
            <button onClick={redirect}>Login</button>
        </div>
    )
}

export default Login;