import React from 'react';
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";


import "./NavBar.css"
interface NavBarProps {
    setLoggedIn: any
}

function NavBar() {

    let navigateTo = useNavigate()

    function signOutUser() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("signed out")
            navigateTo('/login')
            
        }).catch((error) => {
            // An error happened.
            console.log("error")
        });
    }

    return (
        <div className="navbar">
            <Link to="/home">Home</Link>
            <Link to="/listings">My Listings</Link>
            <Link to="/claims">My Claims</Link>
            <Link to="/profile">Profile</Link>
            <a onClick={() => signOutUser()}>Log out</a>
        </div>
    );
}

export default NavBar;