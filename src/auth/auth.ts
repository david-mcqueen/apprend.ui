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
    base_uri: string;
    redirect_path: string;
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

const config: AuthConfig = {
    domain: getEnvString('DOMAIN'),
    client_id: getEnvString('CLIENT_ID'),
    base_uri: getEnvString('BASE_URI'),
    redirect_path: getEnvString('REDIRECT_PATH'),
    region: getEnvString('REGION'),
    response_type: getEnvString('RESPONSE_TYPE'),
    scope: getEnvStringArray('SCOPE'),
}

const tokenIsValid = (token: jwtAuth): boolean => {
    if (token.exp){
        var expireDateTime = new Date(token.exp * 1000);
        return expireDateTime > new Date();
    }

    return false;
}

const refreshToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const data = {
        grant_type: "refresh_token",
        client_id: config.client_id,
        refresh_token: refreshToken,
    }

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: `https://${config.domain}.auth.${config.region}.amazoncognito.com/oauth2/token`
    }

    return await axios(options)
        .then (resp => {                
            console.log(resp);
            storeAccessToken(resp.data.access_token, resp.data.expires_in);
            return resp.data.access_token;
        })
        .catch(err => {
            console.log(err);
            throw new Error(JSON.stringify(err));
        });
}

const storeAccessToken = (accessToken: string, expires_in: string): void => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token_expires_in", expires_in);
}

const storeRefreshToken = (refreshToken: string) : void => {
    localStorage.setItem("refresh_token", refreshToken);
}

export const GetLogoutUrl = (): string => {
    const url = `https://${config.domain}.auth.${config.region}.amazoncognito.com/logout?`
        .concat(`client_id=`, config.client_id)
        .concat(`&logout_uri=`, config.base_uri)

    return url;
}

export const GetLoginUrl = (): string => {
    const pkce = pkceChallenge(128);
    localStorage.setItem("code_challenge", pkce.code_challenge);
    localStorage.setItem("code_verifier", pkce.code_verifier);

    const url = `https://${config.domain}.auth.${config.region}.amazoncognito.com/login?`
        .concat(`client_id=`, config.client_id)
        .concat(`&response_type=`, config.response_type)
        .concat(`&scope=`, config.scope.join(`+`))
        .concat(`&redirect_uri=`, `${config.base_uri}/${config.redirect_path}`)
        .concat('&code_challenge=', pkce.code_challenge)
        .concat('&code_challenge_method=', "S256");

    return url;
}

export const ExchangeCodeForToken = (code: string) => {
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
        redirect_uri: `${config.base_uri}/${config.redirect_path}`,
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
            storeRefreshToken(resp.data.refresh_token);
            storeAccessToken(resp.data.access_token, resp.data.expires_in);
            
            window.location.href = config.base_uri;
        })
        .catch(err => {
            console.log(err);
            throw new Error(JSON.stringify(err));
        });
}

export const DestroyTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expires_in')
}

const GetAuthedUser = async () => {
    const accessToken = localStorage.getItem('access_token');
        if (!accessToken){
            return;
        }
        let decoded: jwtAuth = jwtDecode(accessToken);

        if (!tokenIsValid(decoded)) {
            const newAccessToken = await refreshToken();
            decoded = jwtDecode(newAccessToken);
        }

        return {
            UserName: decoded.username,
            AccessToken:  accessToken,
            jwt: decoded
        }
}

export default GetAuthedUser;