import { Route, Routes, useNavigate } from "react-router-dom";
import Callback from "../pages/Callback";
import Auth, { AuthedUser } from "../auth/auth";
import { useEffect, useState } from "react";

const AuthBar = () => {

    const [auth, setAuth] = useState<AuthedUser>();

    const loginRedirect = () => {
        window.location.href = Auth.GetLoginUrl()
    }

    const logoutRedirect = () => {
        Auth.DestroyTokens();
        window.location.href = Auth.GetLogoutUrl()
    }

    useEffect(() => {
        Auth.GetAuthedUser()
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