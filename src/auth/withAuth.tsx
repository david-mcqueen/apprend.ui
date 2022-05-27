import { Component, ComponentType } from "react";

export function withAuth<T> (WrappedComponent: ComponentType<T>) {

    return class App extends Component {
        constructor(hocProps: T){
            super(hocProps);
        }

        componentWillMount() {
            const activeUser = localStorage.getItem('user'); 
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
