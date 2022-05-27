import { AuthConfig } from "../pages/Login";
import pkceChallenge, { verifyChallenge } from "pkce-challenge";
import axios from "axios";
import qs from "qs";

type AuthedUser = {
    Name: string;
    AccessToken: string;
}

export default class Auth {
    private _config: AuthConfig;
    
    constructor(config: AuthConfig) {
        this._config = config;
    }

    getAuthedUser(): AuthedUser {
        return {
            Name: "Test User",
            AccessToken: "access_token"
        }
    }

    getLoginUrl(): string {
        const pkce = pkceChallenge(128);
        localStorage.setItem("code_challenge", pkce.code_challenge);
        localStorage.setItem("code_verifier", pkce.code_verifier);

        const url = `https://${this._config.domain}.auth.${this._config.region}.amazoncognito.com/login?`
            .concat(`client_id=`, this._config.client_id)
            .concat(`&response_type=`, this._config.response_type)
            .concat(`&scope=`, this._config.scope.join(`+`))
            .concat(`&redirect_uri=`, this._config.redirect_uri)
            .concat('&code_challenge=', pkce.code_challenge)
            .concat('&code_challenge_method=', "S256");

        return url;
    }


    exchangeCodeForToken(code: string) {
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
            redirect_uri: this._config.redirect_uri,
            client_id: this._config.client_id,
            code_verifier: codeVerifier
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `https://${this._config.domain}.auth.${this._config.region}.amazoncognito.com/oauth2/token`
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
                throw new Error(JSON.stringify(err));
            });
    }
}