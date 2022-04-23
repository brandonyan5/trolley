import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./LoginPage.css"

interface LoginPageProps {
    setLoggedIn: any
}

function LoginPage(props: LoginPageProps) {
    const navigateTo = useNavigate()

    const handleLogin = () => {
        // TODO: only set logged in to true and redirect when google authentication is successful
        props.setLoggedIn(true)
        // redirect to marketplace using useNavigation hook (defined above)
        navigateTo("/home")
    }

    return (
        <div className="login-page">
            <div className="login-box">
                <h1>(Login box)</h1>
                <div className="login-button" onClick={() => handleLogin()}>
                    Sign in with Google
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
