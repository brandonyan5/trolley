import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

interface MarketplaceProps {
    isLoggedIn: boolean
}

function Marketplace(props: MarketplaceProps) {
    let navigateTo = useNavigate()

    // redirect to login page if user is not already logged in
    useEffect(() => {
        if (!props.isLoggedIn) {
            navigateTo("/login")
        }
    })

    return (
        <div className="marketplace-page">
            Marketplace
        </div>
    );
}

export default Marketplace;