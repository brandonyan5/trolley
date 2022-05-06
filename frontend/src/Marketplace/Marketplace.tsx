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
    // state for filtered/sorted listings (keep separate so that we don't need to re-query firebase for a fresh copy
    const [processedListingsData, setProcessedListingsData] = useState<ListingsData>({})
    // state for filters: set to be at extremes initially (to display all listings before filtering)
    const [priceFilterRange, setPriceFilterRange] = useState<[number, number]>([0,10])
    const [areaFilterRange, setAreaFilterRange] = useState<[number, number]>([0,200])
    const [distanceFilterRange, setDistanceFilterRange] = useState<[number, number]>([0,10]) // distance in miles
    const [dateFilterRange, setDateFilterRange] = useState([
        {
            startDate: new Date(), // NOTE: this state type is required by the date picker component
            endDate: new Date(),
            key: 'selection'
        }
    ])
    // weights for price, max distance, area (higher = more importance in sorting metric). Range = [0,10] bc HTML sliders can't do decimals
    const [filterWeights, setFilterWeights] = useState<[number, number, number]>([5,5,5])

    /* retrieves ALL listing data from the DB (with a listener attached) and updates state */
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
            console.log("fetched firebase")
            console.log(newestData)
        })
    }

    /* FILTERING & SORTING: pass all listings data to backend and retrieve filtered & sorted listings */
    const filterAndSortListings = () => {
        // get all filters in one object
        const filters = {
            dates: {
                [distanceFilterRange[0]]: distanceFilterRange[1]
            },
            area: {
                [areaFilterRange[0]]: areaFilterRange[1]
            },
            price: {
                [priceFilterRange[0]]: priceFilterRange[1]
            },
            user_address: "69 Brown st", //TODO: SET AS LOGGED-IN USER'S ADDRESS
            distance: distanceFilterRange[1] // only use MAX distance
        }

        // get NORMALIZED filer weights in [0,1] bc slider values are in [0,10]
        const normalizedFilterWeights = filterWeights.map(weight => weight/10)

        const dataToSend = {
            products: listingsData,
            filters: filters,
            filterWeights: normalizedFilterWeights
        }


        // make POST request to endpoint
        fetch('http://localhost:4567/filterAndSortProducts', {
            // Specify the method
            method: 'POST',
            // Specifies that headers should be sent as JSON
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            // Specify the body of the request
            body: JSON.stringify({
                dataToSend
            })
        })
        .then((response) => {
            // return the response as JSON
            return response.json();
        })
        .then((data) => {
            console.log(data)
            // update state if no error
            if (data.error !== undefined) {
                console.log("ERR")
            } else {
                setProcessedListingsData(data);
            }
        }).catch((error) => {
            console.log("JSON error while fetching sorted listings");
        })
    }

    // get all listings data and start db listener once when marketplace is initially rendered
    useEffect(() => {
        getAllListings()
    }, [])

    // filter & sort every time the filters/dates or filter weights are changed by the user
    useEffect(() => {
        console.log("RE-FILTERING")
        filterAndSortListings()
    }, [priceFilterRange, areaFilterRange, distanceFilterRange, dateFilterRange, filterWeights])

    // filter and sort on initial rendering once listingsData has been loaded from DB
    useEffect(() => {
        filterAndSortListings()
    }, [listingsData])


    //  ===== TESTING =========
    useEffect(() => {
        console.log("price: " + priceFilterRange)
        console.log("dist: " + distanceFilterRange)
        console.log("area:" + areaFilterRange)
    }, [priceFilterRange, areaFilterRange, distanceFilterRange])

    useEffect(() => {
        console.log("start: " + getMonthDate(dateFilterRange[0].startDate))
        console.log("end: " + getMonthDate(dateFilterRange[0].endDate))
    }, [dateFilterRange])



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
                    filterWeights={filterWeights}
                    setFilterWeights={setFilterWeights}
                />

                <div className="listings-wrapper">

                    { (processedListingsData !== undefined) &&
                        // map each listing JSON data object to a Listing component
                        Object.keys(processedListingsData).map((listingID) =>
                            <Link key={listingID} to="/products"  state={{product:listingsData[listingID], listingName: listingID}}>
                                <Listing
                                    key={listingID}
                                    listingName={listingID}
                                    data={listingsData[listingID]}
                                    isClaimed={false}
                                />
                            </Link>
                        )
                    }

                    {/*{ Object.keys(listingsData).length > 0 &&*/}
                    {/*    // map each listing JSON data object to a Listing component*/}
                    {/*    Object.keys(listingsData).map((listingID) =>*/}
                    {/*        <Link to  = "/products"  state={{product:listingsData[listingID], listingName: listingID}}>*/}
                    {/*            <Listing key={listingID} listingName={listingID} data={listingsData[listingID]} isClaimed={false} />*/}
                    {/*        </Link>*/}
                    {/*    )*/}
                    {/*}*/}
                </div>
            </div>
        </div>
    );
}

export default Marketplace;