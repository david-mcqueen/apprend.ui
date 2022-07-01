import { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router";
import GetAuthedUser from "./auth";

export function withAuth<T> (WrappedComponent: ComponentType<T>) {

    return (hocProps: T) => {

        const navigate = useNavigate();

        const themeProps = {
            name: "thing"
        }

        useEffect(() => {
            (async () => {
                const activeUser = await GetAuthedUser();
                if (!activeUser){
                    navigate('/');
                }
            })()
        }, [navigate])

        return (
            <WrappedComponent {...(hocProps as T)} {...themeProps}/>
        )
    }
}