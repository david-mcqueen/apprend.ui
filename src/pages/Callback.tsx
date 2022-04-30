import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { json } from "stream/consumers";


const Callback = () => {
    let location = useLocation();
    const [error, setError] = useState<string>();

    useEffect(() => {
        console.log("useEffect");
        const code = new URLSearchParams(location.search).get('code');

        if (!code){
            throw Error("No code returned!")
        }

        const data = {
            code: code,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/callback",
            client_id: "5s4n5nkmqrh88a05s1c8der32c"  
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `https://apprend.auth.eu-west-2.amazoncognito.com/oauth2/token`
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