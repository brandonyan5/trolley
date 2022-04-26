import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 

interface ClaimsPageProps {
    isLoggedIn: boolean,
}

function ClaimsPage() {


    const auth = getAuth()
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }

    });

    return (
        <div>
            <NavBar />
            <div className="claims-page">
                Claims Page
            </div>
        </div>
    )
}

export default ClaimsPage;