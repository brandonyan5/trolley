import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar'
import "./ClaimsPage.css"
import Listing from "../SharedComponents/Listing";
import {ListingsData} from "../Marketplace/Marketplace";
import {getDatabase, onValue, ref} from "firebase/database";
import {checkUserAddressIsValid} from "../SharedComponents/UtilFunctions";

interface ClaimsPageProps {
}

function ClaimsPage(props: ClaimsPageProps) {

    /* AUTH CHECKING */
    const auth = getAuth()
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    const loadedUserID = useRef(false)
    const [claimerID, setClaimerID] = useState<string>("")
    const [claimerEmail, setClaimerEmail] = useState<string>("");

    useEffect(()=> {
        onAuthStateChanged(auth, (user) => {
            if (!loadedUserID.current) {
                if (!user) {
                    navigateTo("/login")
                } else {
                    console.log("onauthstatechanged")
                    console.log("user id: " + user.uid)
                    setClaimerID(user.uid)
                    setClaimerEmail(user.email!)

                    // update ref so that further interactions with page don't trigger hook
                    loadedUserID.current = true
                }
            }
        })
    }, [])

    /* STATE HOOKS */
    // store ALL listings data (to be separated into claimed, completed)
    const [allListingsData, setAllListingsData] = useState<ListingsData>({});
    // two sub-categories for listings
    const [claimedListings, setClaimedListings] = useState<ListingsData>({});
    const [completedListings, setCompletedListings] = useState<ListingsData>({});

    /* retrieves ALL listing data from the DB CLAIMED by the current user (with a listener attached) and updates state */
    const getAllListingsClaimedByUser = () => {
        console.log("== GETTING ALL LISTINGS CLAIMED BY USER ==")
        const db = getDatabase()
        const listingsRef = ref(db, "products")
        // fetch and track "products" JSON object
        onValue(listingsRef, (dataSnapshot) => {
            const allDBListings: ListingsData = dataSnapshot.val()
            // only store current user's claimed listings
            const myListingsClaimed: ListingsData = {}

            Object.keys(allDBListings).map(listingID => {
                const currListing = allDBListings[listingID]
                // only get listings owned by user
                if (currListing.user_id === claimerID) {
                    myListingsClaimed[listingID] = allDBListings[listingID]
                }
            })

            // console.log("ALL fetched data:")
            // console.log(allDBListings)
            // console.log("My listings only:")
            // console.log(myListingsClaimed)
            console.log("UPDATING ALL CLAIMED LISTINGS to:")
            console.log(myListingsClaimed)
            setAllListingsData(myListingsClaimed)
        })
    }

    /* separate the listings into claimed and completed (claimed AND accepted by listing owner) */
    const separateListings = () => {
        // initialize subsets of listings to be populated
        const claimed: ListingsData = {}
        const completed: ListingsData = {}

        // iterate over all listings
        Object.keys(allListingsData).map(listingID => {
            const currListing = allListingsData[listingID]
            if (currListing["user_id"] !== "") {
                if (allListingsData[listingID]["completed"]) {
                    // get completed listings (listings with non-empty "user_id" field AND containing "true" in "completed" field)
                    completed[listingID] = currListing
                } else {
                    // get claimed listings (listings with non-empty "user_id" field AND not completed)
                    claimed[listingID] = currListing
                }
            }
        })

        // console.log("=========")
        // console.log("claimed")
        // console.log(claimed)
        // console.log("completed")
        // console.log(completed)

        // update state
        setClaimedListings(claimed)
        setCompletedListings(completed)
    }


    // initially fetch all listings from DB
    useEffect(() => {
        if (claimerID !== "") {
            checkUserAddressIsValid(claimerID, navigateTo)
            console.log("getting initial listings")
            getAllListingsClaimedByUser()
        }
    }, [claimerID])

    // separate the listings into claimed and completed once all listings have been fetched
    useEffect(() => {
        console.log("all listings data changed")
        console.log("separating listings")
        separateListings()
    }, [allListingsData]);


    return (
        <div>
            <NavBar />
            <div className="claims-page">
                <h2>My Claims</h2>

                <div className="claimed-listings-wrapper">
                    <h3>Claimed Listings</h3>
                    {
                        // render listings claimed by user (if any) else show generic message
                        Object.keys(claimedListings).length > 0 ?
                            Object.keys(claimedListings).map((listingID) =>
                                <Link key={listingID} to="/products"  state={{listingName: listingID, product: claimedListings[listingID]}}>
                                    <Listing
                                        key={listingID}
                                        listingID={listingID}
                                        data={claimedListings[listingID]}
                                        showClaimerBox={false}
                                        showAcceptDecline={false}
                                        showOwnerBox={true}
                                        showUnclaim={true}
                                    />
                                </Link>
                            )
                        :
                        <h4>Nothing to show here</h4>
                    }
                </div>
                <div className="completed-listings-wrapper">
                    <h3>Completed</h3>
                    {
                        // render completed listings (if any) else show generic message
                        Object.keys(completedListings).length > 0 ?
                            Object.keys(completedListings).map((listingID) =>
                                <Link key={listingID} to="/products"  state={{product:completedListings[listingID], listingName: listingID}}>
                                    <Listing
                                        key={listingID}
                                        listingID={listingID}
                                        data={completedListings[listingID]}
                                        showClaimerBox={false}
                                        showAcceptDecline={false}
                                        showOwnerBox={true}
                                        showUnclaim={false}
                                    />
                                </Link>
                            )
                        :
                        <h4>Nothing to show here</h4>
                    }
                </div>
            </div>
        </div>
    )
}

export default ClaimsPage;