import { Route, Routes, useNavigate } from "react-router-dom";
import Callback from "../pages/Callback";
import { AuthedUser, DestroyTokens, GetLoginUrl, GetLogoutUrl } from "../auth/auth";
import { useEffect, useState } from "react";
import GetAuthedUser from "../auth/auth";

const AuthBar = () => {

    const [auth, setAuth] = useState<AuthedUser>();
    const navigate = useNavigate();

    const loginRedirect = () => {
        navigate(GetLoginUrl())
    }

    const logoutRedirect = () => {
        DestroyTokens();
        navigate(GetLogoutUrl())
    }

    useEffect(() => {
        GetAuthedUser()
        .then((user: AuthedUser) => {
            setAuth(user);
        });

    }, [])
    

    const loginButton = () => {
        return (
            <>
                <button onClick={loginRedirect}>Login</button>
            </>
        )
    }

    const logoutButton = (userName: string) => {
        return (
            <>
                Welcome {userName}
                <button onClick={logoutRedirect}>Logout</button>
            </>
        )
    }

    return (
        <div>
            <Routes>
                <Route path="/callback" element={<Callback />}/>
            </Routes>
            {auth ? logoutButton(auth.UserName) : loginButton()}
        </div>
    )
}

export default AuthBar;