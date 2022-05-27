import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Auth from "../auth/auth";
import { AuthConfig } from "./Login";


const Callback = (auth: Auth) => {
    let location = useLocation();

    useEffect(() => {
        console.log("useEffect");
        const code = new URLSearchParams(location.search).get('code');

        if (!code){
            throw Error("No code returned!")
        }

        // Auth.exchangeCodeForToken(code);
        
    }, []);

    return (<></>);
}


export default Callback;