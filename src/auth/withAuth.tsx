import { Component, ComponentType, useEffect } from "react";

export function withAuth<T> (WrappedComponent: ComponentType<T>) {

    return class App extends Component {
        constructor(hocProps: T){
            super(hocProps);
        }

        componentWillMount() {
            const getToken = localStorage.getItem('token'); 
            // if(!getToken) { 
            //    this.props.history.replace({pathname: '/'}); 
            // } 
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
