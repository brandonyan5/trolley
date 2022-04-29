import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar'
import "./Marketplace.css"
import {firebaseConfig} from "../Login/LoginPage";
import Listing, {ListingData} from "../SharedComponents/Listing";
import {uploadImage} from "../SharedComponents/UtilFunctions"
import { getDatabase, ref, onValue } from "firebase/database";


interface MarketplaceProps {
    // isLoggedIn: boolean
}

type ListingsData = {
    // each listing/product ID is mapped to its dictionary of data.
    // the inner dictionary maps field names (e.g. price, address, etc) to values
    [listingID: string]: ListingData
}


function Marketplace(props: MarketplaceProps) {
    // check for valid login
    const auth = getAuth()
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }
    });

    // set state for all listings in marketplace (dictionary of dictionaries where each dictionary is for one listing)
    const [listingsData, setListingsData] = useState<ListingsData>({})


    const getAllListings = () => {
        // get reference to db
        const db = getDatabase()
        // get reference to node we want to read
        const listingsRef = ref(db, "products")
        // fetch and track "products" JSON object
        onValue(listingsRef, (dataSnapshot) => {
            const newestData = dataSnapshot.val()
            // set data to be fed to each listing
            setListingsData(newestData)
        })
    }

    // get all listings data and start listener once when marketplace is initially rendered
    useEffect(() => {
        getAllListings()
    }, [])

    return (
        <div className="marketplace">
            <NavBar />
            <div className="marketplace-content">
                <div className="filters-bar">

                </div>

                <p>upload img1</p>
                <input onChange={(e) => uploadImage(e, "product1/img1")} type="file"/>
                <p>upload img2</p>
                <input onChange={(e) => uploadImage(e, "product2/img1")} type="file"/>
                <p>upload img3</p>
                <input onChange={(e) => uploadImage(e, "product3/img1")} type="file"/>
                <p>upload img4</p>
                <input onChange={(e) => uploadImage(e, "product4/img1")} type="file"/>
                <p>upload img5</p>
                <input onChange={(e) => uploadImage(e, "product5/img1")} type="file"/>

                <div className="listings-wrapper">
                    { Object.keys(listingsData).length > 0 &&
                        // map each listing JSON data object to a Listing component
                        Object.keys(listingsData).map((listingID) =>
                            <Listing key={listingID} listingName={listingID} data={listingsData[listingID]} isClaimed={false} />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Marketplace;