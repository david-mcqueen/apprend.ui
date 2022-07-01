import { Component, ComponentType, useEffect } from "react";
import { useNavigate } from "react-router";
import Auth from "./auth";

export function withAuth<T> (WrappedComponent: ComponentType<T>) {

    return (hocProps: T) => {

        const navigate = useNavigate();

        const themeProps = {
            name: "thing"
        }

        useEffect(() => {
            (async () => {
                const activeUser = await Auth.GetAuthedUser();
                debugger;
                if (!activeUser){
                    navigate('/');
                }
            })()
        }, [])

        return (
            <WrappedComponent {...(hocProps as T)} {...themeProps}/>
        )
    }
}