import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import NavBar from "../SharedComponents/NavBar";
import {getAuth, onAuthStateChanged} from "firebase/auth";


interface ListingsPageProps {
    // isLoggedIn: boolean
}

function ListingsPage(props: ListingsPageProps) {

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
            <div className="listings-page">
                Listings Page
            </div>
        </div>
        );
}

export default ListingsPage;