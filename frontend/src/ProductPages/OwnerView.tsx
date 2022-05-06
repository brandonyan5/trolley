import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Button} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {getImageSrc} from "../SharedComponents/UtilFunctions";



import './products.css'

function OwnerView() {

    // Firebase states
    const auth = getAuth()

    // Const for accessing info from location state
    const location  = useLocation()
    const state = location.state as {[key:string] : string | ListingData}

    const listingDate = state.listingData as ListingData

    // states for editability and keeping track of listing properties
    const [editable, setEditable] = useState(false)
    const [address, setAddress] = useState(listingDate.address)
    const [area, setArea] = useState(listingDate.area)
    const [dateStart, setDateStart] = useState(listingDate.date_start)
    const [dateEnd, setDateEnd] = useState(listingDate.date_end)
    const [price, setPrice] = useState(listingDate.price)
    const listingID = state.listingID as string
    // STATE FOR OWNER ID, NOT EMAIL

    // check if listinData's hasClaim boolean, if False, make editable true

    const postListing  = () => {

        const user = auth.currentUser
        const db = getDatabase()

        const updates : {[key: string] : string|boolean} = {}

        updates['/users/' + user?.uid + "/listings/" + listingID] = listingID;
        updates['/products/' + listingID + "/address"] = address;
        updates['/products/' + listingID + "/date_start"] = dateStart;
        updates['/products/' + listingID + "/date_end"] = dateEnd;
        updates['/products/' + listingID + "/area"] = area;
        updates['/products/' + listingID + "/price"] = price;

        update(ref(db), updates)

    }

}

export default OwnerView