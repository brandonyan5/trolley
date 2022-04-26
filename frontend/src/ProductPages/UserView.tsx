import React from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 

interface UserViewProps {
    // possible props to consider: listing_id
}

function UserView() {
    return (
        <div>
            User view product page
        </div>
    );
}

export default UserView;