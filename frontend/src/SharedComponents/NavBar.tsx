import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import "./NavBar.css"
interface NavBarProps {
    setLoggedIn: any
}

function NavBar(props: NavBarProps) {
    const navigateTo = useNavigate()

    const handleLogout = () => {
        // TODO: make google authentication void
        props.setLoggedIn(false)
        navigateTo("/login")
    }

    return (
        <div className="navbar">
            <Link to="/home">Home</Link>
            <Link to="/listings">My Listings</Link>
            <Link to="/claims">My Claims</Link>
            <Link to="/profile">Profile</Link>
            <a onClick={() => handleLogout()}>Log out</a>
        </div>
    );
}

export default NavBar;