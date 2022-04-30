import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';


interface UserViewProps {
    // possible props to consider: listing_id
    listing_id : string
}

function UserView(props: UserViewProps) {

    // Hooks for email, address, phone number, and privacy settings
    const [address, setAddress] = useState("")
    const [area, setArea] = useState(0)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [owner, setOwner] = useState("")
    const [price, setPrice] = useState(0)
    const [user, setUser] = useState("")
    const [claimed, setClaimed] = useState("")

    // Firebase consts
    const auth = getAuth()
    const db = getDatabase();
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        console.log('why')
        if (!user) {
            navigateTo("/login")
        } 

    });

    //get user info  data and start listener once when profile page is initially rendered
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                readListingData()
            }
        });
    }, [])

    /**
     * Reads the data associated with this particular listing by getting the info
     * from the database
     */
    function readListingData() {
        
        // Get firebase const info
        const user = auth.currentUser
        const userRef = ref(db, 'users/' + user!.uid);

        // Check if entry exists in database, if not, add them
        onValue(userRef, (snapshot) => {
            const data : ListingData = snapshot.val();
        },
        {
            onlyOnce: true
        });
    }

    return (
        <div>
            User view product page
        </div>
    );
}

export default UserView;