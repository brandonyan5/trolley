// @ts-ignore

import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar'
import "./Marketplace.css"
import Listing, {ListingData} from "../SharedComponents/Listing";
import {getMonthDate, uploadImage} from "../SharedComponents/UtilFunctions"
import { getDatabase, ref, onValue } from "firebase/database";
import FilterBar from "./FilterBar";


interface MarketplaceProps {

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
    // state for filters
    const [priceFilterRange, setPriceFilterRange] = useState<[number, number]>([0,20])
    const [areaFilterRange, setAreaFilterRange] = useState<[number, number]>([50,300])
    const [distanceFilterRange, setDistanceFilterRange] = useState<[number, number]>([0,3]) // distance in miles
    const [dateFilterRange, setDateFilterRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

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



    // get all listings data and start db listener once when marketplace is initially rendered
    useEffect(() => {
        getAllListings()
    }, [])

    useEffect(() => {
        console.log("price: " + priceFilterRange)
        console.log("dist: " + distanceFilterRange)
        console.log("area:" + areaFilterRange)
    }, [priceFilterRange, areaFilterRange, distanceFilterRange])

    useEffect(() => {
        console.log("start: " + getMonthDate(dateFilterRange[0].startDate))
        console.log("end: " + getMonthDate(dateFilterRange[0].endDate))
    }, [dateFilterRange])


    // your link creation
const newTo = { 
    pathname: "/products", 
    state: "Par1" 
  };
    
    return (
        <div className="marketplace">
            <NavBar />
            <div className="marketplace-content">

                {/*<p>upload img1</p>*/}
                {/*<input onChange={(e) => uploadImage(e, "product1/img1")} type="file"/>*/}

                <FilterBar
                    priceFilterRange={priceFilterRange}
                    areaFilterRange={areaFilterRange}
                    distanceFilterRange={distanceFilterRange}
                    setPriceFilterRange={setPriceFilterRange}
                    setAreaFilterRange={setAreaFilterRange}
                    setDistanceFilterRange={setDistanceFilterRange}
                    dateFilterRange={dateFilterRange}
                    setDateFilterRange={setDateFilterRange}
                />

                <div className="listings-wrapper">
                    
                    { Object.keys(listingsData).length > 0 &&
                        // map each listing JSON data object to a Listing component
                        Object.keys(listingsData).map((listingID) =>
                            <Link to  = "/products"  state={{product:listingsData[listingID], listingName: listingID}}>
                                <Listing key={listingID} listingName={listingID} data={listingsData[listingID]} isClaimed={false} />
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Marketplace;