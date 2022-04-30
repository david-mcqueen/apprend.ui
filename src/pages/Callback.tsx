import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyChallenge } from "pkce-challenge";
import { LoginConfig } from "./Login";


const Callback = (config: LoginConfig) => {
    let location = useLocation();
    const [error, setError] = useState<string>();

    useEffect(() => {
        console.log("useEffect");
        const code = new URLSearchParams(location.search).get('code');

        if (!code){
            throw Error("No code returned!")
        }

        const codeVerifier = localStorage.getItem("code_verifier");
        const codeChallenge = localStorage.getItem("code_challenge");

        if (!(codeVerifier && codeChallenge) || !verifyChallenge(codeVerifier, codeChallenge)){
            throw Error("Error obtaining Token");
        }
        
        localStorage.removeItem("code_verifier");
        localStorage.removeItem("code_challenge");

        const data = {
            code: code,
            grant_type: "authorization_code",
            redirect_uri: config.redirect_uri,
            client_id: config.client_id,
            code_verifier: codeVerifier
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `https://${config.domain}.auth.${config.region}.amazoncognito.com/oauth2/token`
        }

        axios(options)
            .then (resp => {
                console.log(resp.data);
                
                localStorage.setItem("access_token", resp.data.access_token);
                localStorage.setItem("refresh_token", resp.data.refresh_token)
                // localStorage.setItem("token_expires_in", 3600)
                window.location.href="http://localhost:3000/query"

            })
            .catch(err => {
                console.log(err);
                setError(JSON.stringify(err));
            });
        
    }, []);

    return (<>{error}</>);
}


export default Callback;