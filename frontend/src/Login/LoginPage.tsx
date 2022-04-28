import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./LoginPage.css"
import { Icon } from '@iconify/react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


interface LoginPageProps {
    // setLoggedIn: any
}

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCavqS3bFTn25JSvlJaiJm24DwvOHaCKzA",
  authDomain: "trolley-638e8.firebaseapp.com",
  databaseURL: "https://trolley-638e8-default-rtdb.firebaseio.com",
  projectId: "trolley-638e8",
  storageBucket: "trolley-638e8.appspot.com",
  messagingSenderId: "869893521437",
  appId: "1:869893521437:web:bf3d78406bdd3074a186f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function LoginPage(props: LoginPageProps) {
    
    const navigateTo = useNavigate()

    const newLogin = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential!.accessToken;
            // The signed-in user info.
            const user = result.user;
            

            // redirect to marketplace using useNavigation hook (defined above)
            navigateTo("/home")

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (     
        
        <div className = "login-body">
            <div className = "login">
                <Icon icon="mdi:dolly" className = 'dolly-icon' color="white" width='100px'/>
                <h2 className = "login-header">Trolley</h2>
                <button className="login-button" onClick = {newLogin}>Login with Google</button>    
            </div>
        </div>
    );
}

export default LoginPage;
