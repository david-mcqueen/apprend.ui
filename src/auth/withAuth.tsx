import { Component, ComponentType } from "react";
import Auth from "./auth";

export function withAuth<T> (WrappedComponent: ComponentType<T>) {

    return class App extends Component {
        constructor(hocProps: T){
            super(hocProps);
        }

        componentWillMount() {
            // ToDo:- 
            const activeUser = Auth.GetAuthedUser();
            if(!activeUser.AccessToken) { 
               window.location.href = '/';
            }
        }

        getAuthedUser(): string {
            return "abc";
        }

        render() {

            const themeProps = {
                name: "thing"
            }

            return <WrappedComponent {...(this.props as T)} {...themeProps}/>
        }
    }
}
