import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
interface ClaimsPageProps {
    isLoggedIn: boolean,
}

function ClaimsPage(props: ClaimsPageProps) {
    let navigateTo = useNavigate()

    // redirect to login page if user is not already logged in
    useEffect(() => {
        if (!props.isLoggedIn) {
            navigateTo("/login")
        }
    })

    return (
        <div>
            <p>My claims page</p>
        </div>
    )
}

export default ClaimsPage;