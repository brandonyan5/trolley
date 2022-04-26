import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import NavBar from "../SharedComponents/NavBar";


interface ListingsPageProps {
    isLoggedIn: boolean
}

function ListingsPage() {
    let navigateTo = useNavigate()

    // redirect to login page if user is not already logged in
    

    return (
        <div>
            <NavBar />
            <div className="listings-page">
                Listings Page
            </div>
        </div>
        );
}

export default ListingsPage;