// @ts-ignore

import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar'
import "./Marketplace.css"
import Listing, {ListingData} from "../SharedComponents/Listing";
import {getFullDate, getFullDateHyphens, getMonthDate, uploadImage} from "../SharedComponents/UtilFunctions"
import { getDatabase, ref, onValue } from "firebase/database";
import FilterBar from "./FilterBar";
import {addressestoDistance} from "../Haversine/haversine";


interface MarketplaceProps {

}

export type ListingsData = {
    // each listing/product ID is mapped to its dictionary of data.
    // the inner dictionary maps field names (e.g. price, address, etc) to values
    [listingID: string]: ListingData
}


function Marketplace(props: MarketplaceProps) {
    // check for valid login
    const auth = getAuth()
    let navigateTo = useNavigate()

    const [userID, setUserID] = useState<string>("")
    const [userAddress, setUserAddress] = useState("")
    const loadedUserID = useRef(false)

    useEffect(()=> {
        onAuthStateChanged(auth, (user) => {
            if (!loadedUserID.current) {
                if (!user) {
                    navigateTo("/login")
                } else {
                    console.log("onauthstatechanged")

                    console.log(" setting user id")
                    setUserID(user.uid)
                    // update ref so that further interactions with page don't trigger hook
                    loadedUserID.current = true
                }
            }
        })
    }, [])


    // set state for ALL listings in marketplace (dictionary of dictionaries where each dictionary is for one listing)
    const [listingsData, setListingsData] = useState<ListingsData>({})
    const fetchedDataFromDB = useRef<boolean>(false);
    // state for filtered/sorted listings (keep separate so that we don't need to re-query firebase for a fresh copy each time
    const [processedListingsData, setProcessedListingsData] = useState<ListingsData>({})
    // flag for whether all distances have been calculated (asynchronously)
    const calculatedDistances = useRef<boolean>(false);
    // state for filters: set to be at extremes initially (to display all listings before filtering)
    const [priceFilterRange, setPriceFilterRange] = useState<[number, number]>([0,10])
    const [areaFilterRange, setAreaFilterRange] = useState<[number, number]>([5,200])
    const [distanceFilterRange, setDistanceFilterRange] = useState<[number, number]>([0,5]) // distance in miles
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
        console.log("== GETTING ALL LISTINGS")
        // get reference to db
        const db = getDatabase()
        // get reference to node we want to read
        const listingsRef = ref(db, "products")
        // fetch and track "products" JSON object
        onValue(listingsRef, (dataSnapshot) => {
            const newestData = dataSnapshot.val()
            // get user address
            console.log("user ID in onval: " + userID)
            onValue(ref(db, `users/${userID}/address`), (addressSnapshot) => {
                if (!fetchedDataFromDB.current) {
                    console.log("user address: " + addressSnapshot.val())
                    setUserAddress(addressSnapshot.val())

                    // set data to be fed to each listing
                    console.log("initial data w/out dists:")
                    console.log(newestData)
                    setListingsData(newestData)
                    fetchedDataFromDB.current = true
                }
            })
        })
    }

    /* Helper function to get relative distances of listings to the current user. Sets listingsData. Should be called once initially */
    const setListingsDistances = async () => {
        if (!calculatedDistances.current) {
            // make copy of distance-less listingsData
            // const dataCopy: ListingsData = Object.assign({}, listingsData)
            const dataCopy: ListingsData = JSON.parse(JSON.stringify(listingsData));


            // iterate over each listing and calculate distance (append new "distance" field to each listing)
            // NOTE: line below only resolves when all promises within the loop (for retrieving distance) resolve
            await Promise.all(Object.keys(listingsData).map(async listingID => {
                await addressestoDistance(userAddress, dataCopy[listingID].address).then(dist => {
                    if (dist !== "ERROR") {
                        dataCopy[listingID]["distance"] = dist
                    } else {
                        delete dataCopy[listingID]
                        console.log("HAVERSINE ERROR")
                    }

                })
            }))

            // set listingsData to be the copy once all distances have been calculated
            setListingsData(dataCopy)
            calculatedDistances.current = true
        }
    }

    /* FILTERING & SORTING: pass all listings data to backend and retrieve filtered & sorted listings */
    const filterAndSortListings = () => {
        // get all filters in one object
        const filters = {
            dates: {
                [getFullDateHyphens(dateFilterRange[0].startDate)]: getFullDateHyphens(dateFilterRange[0].endDate)
            },
            area: {
                [areaFilterRange[0]]: areaFilterRange[1]
            },
            price: {
                [priceFilterRange[0]]: priceFilterRange[1]
            },
            distance: distanceFilterRange[1] // only use MAX distance
        }

        // get NORMALIZED filer weights in [0,1] bc slider values are in [0,10]
        const normalizedFilterWeights = filterWeights.map(weight => weight/10)

        const dataToSend = {
            products: listingsData,
            filters: filters,
            filterWeights: normalizedFilterWeights
        }


        if (calculatedDistances.current) {
            console.log("data to send")
            console.log(dataToSend)

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
                    console.log("from backend:")
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
    }

    // get all listings data and start db listener once when marketplace is initially rendered AND user ID has been retrieved
    useEffect(() => {
        if (userID !== "") {
            console.log("getting initial listings")
            getAllListings()
        }
    }, [userID])

    // calculate relative distance to each listing once current user's address has been fetched
    useEffect(() => {
        if (userAddress !== "") {
            setListingsDistances()
        }
    }, [userAddress]);


    // filter & sort every time the filters/dates or filter weights are changed by the user
    useEffect(() => {
        if (Object.keys(listingsData).length > 0) {
            console.log("fetching on filter change")
            filterAndSortListings()
        }
    }, [priceFilterRange, areaFilterRange, distanceFilterRange, dateFilterRange, filterWeights])

    // filter and sort on initial rendering once listingsData has been loaded from DB
    useEffect(() => {
        if (Object.keys(listingsData).length > 0 && calculatedDistances.current) {
            console.log("fetching initial")
            filterAndSortListings()
        }
    }, [listingsData])


    //  ===== TESTING =========
    // useEffect(() => {
    //     console.log("price: " + priceFilterRange)
    //     console.log("dist: " + distanceFilterRange)
    //     console.log("area:" + areaFilterRange)
    // }, [priceFilterRange, areaFilterRange, distanceFilterRange])
    //
    // useEffect(() => {
    //     console.log("start: " + getMonthDate(dateFilterRange[0].startDate))
    //     console.log("end: " + getMonthDate(dateFilterRange[0].endDate))
    // }, [dateFilterRange])



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
                                    showClaimedBox={false}
                                    showAcceptDecline={false}
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