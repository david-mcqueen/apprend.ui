import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExchangeCodeForToken } from "../auth/auth";


const Callback = () => {
    let location = useLocation();

    useEffect(() => {
        console.log("useEffect");
        const code = new URLSearchParams(location.search).get('code');

        if (!code){
            throw Error("No code returned!")
        }

        ExchangeCodeForToken(code);
        
    }, [location.search]);

    return (<></>);
}


export default Callback;