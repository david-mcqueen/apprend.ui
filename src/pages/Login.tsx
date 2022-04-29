const Login = () => {

    const redirect = () => {
        window.location.href = "https://apprend.auth.eu-west-2.amazoncognito.com/login?client_id=5s4n5nkmqrh88a05s1c8der32c&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:3000/callback";
    }

    

    return (
        <button onClick={redirect}>Login</button>
    )
}

export default Login;