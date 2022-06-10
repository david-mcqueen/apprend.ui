import pkceChallenge, { verifyChallenge } from "pkce-challenge";
import axios from "axios";
import qs from "qs";
import jwtDecode from "jwt-decode";

export type AuthedUser = {
    UserName: string;
    AccessToken: string;
    jwt: jwtAuth;
}

type jwtAuth = {
    iss: string,
    version: number,
    client_id: string,
    origin_jti: string,
    token_use: string,
    scope: string,
    auth_time: number,
    exp: number,
    iat: number,
    jti: string,
    username: string
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
    const val = getEnvString(envName);
    return JSON.parse(val);
}

export default class Auth {
    private static _config: AuthConfig = {
        domain: getEnvString('DOMAIN'),
        client_id: getEnvString('CLIENT_ID'),
        redirect_uri: getEnvString('REDIRECT_URL'),
        region: getEnvString('REGION'),
        response_type: getEnvString('RESPONSE_TYPE'),
        scope: getEnvStringArray('SCOPE')
    }

    public static DestroyTokens(): void {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_expires_in')
    }

    public static async GetAuthedUser(): Promise<AuthedUser> {

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken){
            throw new Error('Unauthorised');
        }
        let decoded: jwtAuth = jwtDecode(accessToken);

        if (!this.tokenIsValid(decoded)) {
            const newAccessToken = await this.refreshToken();
            decoded = jwtDecode(newAccessToken);
        }

        return {
            UserName: decoded.username,
            AccessToken:  accessToken,
            jwt: decoded
        }
    }

    private static tokenIsValid(token: jwtAuth): boolean {
        if (token.exp){
            var expireDateTime = new Date(token.exp * 1000);
            return expireDateTime > new Date();
        }

        return false;
    }

    private static async refreshToken(): Promise<string>{
        // ToDo:- Use the refresh token to get a new access token and return it in its raw form
        const refreshToken = localStorage.getItem('refresh_token');
        const data = {
            grant_type: "refresh_token",
            client_id: this._config.client_id,
            refresh_token: refreshToken,
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `https://${this._config.domain}.auth.${this._config.region}.amazoncognito.com/oauth2/token`
        }
        return await axios(options)
            .then (resp => {                
                console.log(resp);
                this.storeAccessToken(resp.data.access_token, resp.data.expires_in);
                return resp.data.access_token;
            })
            .catch(err => {
                console.log(err);
                throw new Error(JSON.stringify(err));
            });
    }

    private static storeAccessToken(accessToken: string, expires_in: string): void {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expires_in", expires_in);
    }
    
    private static storeRefreshToken(refreshToken: string) : void{
        localStorage.setItem("refresh_token", refreshToken);
    }

    public static GetLogoutUrl(): string {
        const url = `https://${this._config.domain}.auth.${this._config.region}.amazoncognito.com/logout?`
            .concat(`client_id=`, this._config.client_id)
            .concat(`&logout_uri=`, 'http://localhost:3000')

        return url;
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
                this.storeRefreshToken(resp.data.refresh_token);
                this.storeAccessToken(resp.data.access_token, resp.data.expires_in);
                
                // Todo:- relative redirect
                window.location.href="http://localhost:3000";
            })
            .catch(err => {
                console.log(err);
                throw new Error(JSON.stringify(err));
            });
    }
}