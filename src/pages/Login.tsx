import { Route, Routes, useNavigate } from "react-router-dom";
import Callback from "./Callback";
import pkceChallenge from "pkce-challenge"
import Auth from "../auth/auth";

export interface AuthConfig {
    domain: string;
    region: string;
    client_id: string;
    response_type: string;
    scope: string[];
    redirect_uri: string;
}

const Login = (auth: Auth) => {

    const navigate = useNavigate();

    const redirect = () => {
        navigate(auth.getLoginUrl());
    }

    return (
        <div>
            <Routes>
                <Route path="/callback" element={<Callback {...auth}/>}/>
            </Routes>
                
            <button onClick={redirect}>Login</button>
        </div>
    )
}

export default Login;