import React from 'react';
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';



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
            <Link to="/home">
                <Icon icon="mdi:dolly" className = "dolly" color="white" width='50px'/>
            </Link>
            <div className = "nav-content">
                <Link className = "nav-buttons" to="/listings">My Listings</Link>
                <Link className = "nav-buttons" to="/claims">My Claims</Link>
                <Link to="/profile">
                    <Icon onClick={() => signOutUser()} icon="iconoir:profile-circled" color="white" width='40px' />
                </Link>
            </div>
        </div>
    );
}

export default NavBar;