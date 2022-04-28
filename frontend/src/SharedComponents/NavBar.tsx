import React from 'react';
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import Container from 'react-bootstrap/Container'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';




import "./NavBar.css"
interface NavBarProps {
    // setLoggedIn: any
}

function NavBar(props: NavBarProps) {

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
        /*
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
        </div> */
        
        <Navbar className = "navbar" expand="lg"  bg = "#031C34" variant="dark">
            <Navbar.Brand>
                <Link to="/home">
                    <Icon icon="mdi:dolly" className = "dolly" color="white" width='50px'/>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className= "toggle" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link as={Link} to= "/listings" className = "nav-buttons">My Listings</Nav.Link>
                <NavDropdown  align={{ lg: 'end' }} className ="dropdown-menu-right"
                title={<Icon className = "profile" icon="iconoir:profile-circled"  width='40px' /> }
                id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to= "/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item  onClick={signOutUser}>Sign Out</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
    </Navbar>  
    

        
    );
}

export default NavBar;