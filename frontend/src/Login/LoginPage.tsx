import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./LoginPage.css"
import { Icon } from '@iconify/react';
import { getDatabase, ref, onValue, DataSnapshot, set} from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


interface LoginPageProps {
    // setLoggedIn: any
}

// Web app's Firebase configuration
export const firebaseConfig = {
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

export function LoginPage(props: LoginPageProps) {
    
    const navigateTo = useNavigate()

    /**
     * Checks the user id of the user and adds them to the database if
     * their information isn't already stored 
     */
    function storeUser() {
        const auth = getAuth();
        const db = getDatabase();
        const user  = auth.currentUser
        const userRef = ref(db, 'users/' + user!.uid);

        // Check if entry exists in database, if not, add them
        onValue(userRef, (snapshot) => {
          if(!snapshot.exists()) {
            set(ref(db, 'users/'+user!.uid), {
                claims : "",
                email : user?.email,
                listings : "",
                name: user?.displayName,
                address: "",
                phone: "",
                show_phone: true,
                show_email: true

            });
          }
        },
        {
            onlyOnce: true
        });
    
      }

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

            // Add user to the database if not already there
            storeUser()

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

