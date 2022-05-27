import pkceChallenge, { verifyChallenge } from "pkce-challenge";
import axios from "axios";
import qs from "qs";

type AuthedUser = {
    Name: string;
    AccessToken: string;
}

export interface AuthConfig {
    domain: string;
    region: string;
    client_id: string;
    response_type: string;
    scope: string[];
    redirect_uri: string;
}

const getEnvString = (envName: string) : string => {
    const val = process.env[`REACT_APP_${envName}`];
    if (!val){
        throw new Error(`Unable to get env variable: ${envName}`)
    }

    return val;
}

const getEnvStringArray = (envName: string): string[] => {
    debugger;
    const val = getEnvString(envName);
    // TODO:- 
    return [];
}

// As part of the constructor, this gets its auth stuff from env variables
// so that it can be creatred from anywehre, even outside of the wrapper and no one place needs to pass the config in
// Thius can then be used by the wrapper, but also by other things (such as callback / graphql) to get the token when doing API calls

export default class Auth {
    private static _config: AuthConfig = {
        domain: getEnvString('DOMAIN'),
        client_id: getEnvString('CLIENT_ID'),
        redirect_uri: getEnvString('REDIRECT_URL'),
        region: getEnvString('REGION'),
        response_type: getEnvString('RESPONSE_TYPE'),
        scope: getEnvStringArray('SCOPE')
    }

    public static GetAuthedUser(): AuthedUser {
        return {
            Name: "Test User",
            AccessToken: "access_token"
        }
    }

    public static GetLoginUrl(): string {
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


    public static ExchangeCodeForToken(code: string) {
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