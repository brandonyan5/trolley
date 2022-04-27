import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 

interface MarketplaceProps {
    // isLoggedIn: boolean
}

function Marketplace(props: MarketplaceProps) {
    

    const auth = getAuth()

    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }

    });

    return (
        <div>
            <NavBar />
            <div className="marketplace-page">
                Marketplace
            </div>
        </div>
    );
}

export default Marketplace;