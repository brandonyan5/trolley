import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

interface ProfilePageProps {
    isLoggedIn: boolean
}

function ProfilePage(props: ProfilePageProps) {
    let navigateTo = useNavigate()

    // redirect to login page if user is not already logged in
    useEffect(() => {
        if (!props.isLoggedIn) {
            navigateTo("/login")
        }
    })

    return (
        <div>
            Profile page
        </div>
    );
}

export default ProfilePage;