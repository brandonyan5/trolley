import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

interface ListingsPageProps {
    isLoggedIn: boolean
}

function ListingsPage(props: ListingsPageProps) {
    let navigateTo = useNavigate()

    // redirect to login page if user is not already logged in
    useEffect(() => {
        if (!props.isLoggedIn) {
            navigateTo("/login")
        }
    })

    return (
        <div className="listings-page">
            My Listings page
        </div>
    );
}

export default ListingsPage;