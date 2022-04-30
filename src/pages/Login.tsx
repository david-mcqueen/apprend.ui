import { Route, Routes } from "react-router-dom";
import Callback from "./Callback";

export interface LoginConfig {
    domain: string;
    region: string;
    client_id: string;
    response_type: string;
    scope: string[];
    redirect_uri: string;
}

const Login = (config: LoginConfig) => {

    const redirect = () => {
        const url = `https://${config.domain}.auth.${config.region}.amazoncognito.com/login?`
            .concat(`client_id=`, config.client_id)
            .concat(`&response_type=`, config.response_type)
            .concat(`&scope=`, config.scope.join(`+`))
            .concat(`&redirect_uri=`, config.redirect_uri);

            window.location.href = url;
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