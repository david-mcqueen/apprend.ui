import { Route, Routes } from "react-router-dom";
import Callback from "./Callback";
import pkceChallenge from "pkce-challenge"

export interface LoginConfig {
    domain: string;
    region: string;
    client_id: string;
    response_type: string;
    scope: string[];
    redirect_uri: string;
}

const Login = (config: LoginConfig) => {

    //ToDo:- Create some sort of wrapper for all of this to make it easier to use and have some "protected" areas of the site

    const redirect = () => {

        // ToDo:- oAuth state

        const pkce = pkceChallenge(128);
        localStorage.setItem("code_challenge", pkce.code_challenge);
        localStorage.setItem("code_verifier", pkce.code_verifier);

        const url = `https://${config.domain}.auth.${config.region}.amazoncognito.com/login?`
            .concat(`client_id=`, config.client_id)
            .concat(`&response_type=`, config.response_type)
            .concat(`&scope=`, config.scope.join(`+`))
            .concat(`&redirect_uri=`, config.redirect_uri)
            .concat('&code_challenge=', pkce.code_challenge)
            .concat('&code_challenge_method=', "S256");

            window.location.href = url;
    }

    return (
        <div>
            <Routes>
                <Route path="/callback" element={<Callback {...config}/>}/>
            </Routes>
                
            <button onClick={redirect}>Login</button>
        </div>
    )
}

export default Login;