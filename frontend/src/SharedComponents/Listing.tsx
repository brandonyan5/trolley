import React, {useEffect, useState} from 'react';
import {getImageSrc, sendEmailOnDecision} from "./UtilFunctions";
import "../SharedComponents/Listing.css"
import {getDatabase, onValue, ref, update} from "firebase/database";
import {UserData} from "../Profile/ProfilePage";

// Type for the JSON data of a single listing = map from string -> string (field name -> field value)
export type ListingData = {
    address: string
    area: string
    date_start: string
    date_end: string
    price: string
    owner_id: string
    user_id: string | null // null if listing has not been claimed, else string ID of the claimer
    completed: boolean // true if user has claimed AND owner then accepts the claim
    distance?: string // distance is calculated asynchronously
}

interface ListingProps {
    listingID: string,
    data: ListingData,
    showClaimedBox: boolean,
    showAcceptDecline: boolean,
    ownerEmail?: string // optionally accept owner email for claimed listings (so that we don't need more listeners)
}

function Listing(props: ListingProps) {
    const [img, setImg] = useState("");
    const [claimerName, setClaimerName] = useState<string>("");
    const [claimerEmail, setClaimerEmail] = useState<string>("");
    const [claimerPhone, setClaimerPhone] = useState<string>("");

    const loadImg = async (relativeImgURL: string) => {
        // resolve promise by only updating img AFTER the promise is returned from getImageSrc
        const res = await getImageSrc(relativeImgURL)
        setImg(res)
    }

    // access profile info of claimer if it exists
    const getUserClaim = () => {
        // get database
        const db = getDatabase()
        const userRef = ref(db, 'users/' + props.data.user_id);
        // Get info of the claimer of this listing
        onValue(userRef, (snapshot) => {
                const data : UserData = snapshot.val();
                setClaimerName(data.name)
                setClaimerEmail(data.email)
                setClaimerPhone(data.phone)
            },
            {
                onlyOnce: true
            })
    }

    // load image once upon initial rendering of listing
    useEffect(() => {
        // path to image is in the format "product<number>/img<number>"
        loadImg(`${props.listingID}/img1`)
    }, [props.listingID])

    // get detail of claimers (if any)
    useEffect(() => {
        if(props.data.user_id != "") {
            getUserClaim()
        }
    }, [props.data.user_id]);


    /* Event handlers */

    // sends acceptance email to claimer
    const onClickDecision = (e: React.MouseEvent, ownerAccepted: boolean) => {
        // stop redirection to product page
        e.stopPropagation()
        e.preventDefault()
        if (props.ownerEmail !== undefined) {
            const db = getDatabase()
            if (ownerAccepted) {
                console.log("sending accept email")
                sendEmailOnDecision(props.data, claimerEmail, props.ownerEmail, true)
                // mark listing as completed in DB
                const updates : {[key: string] : string|boolean} = {}
                updates['/products/' + props.listingID + "/completed"] = true;
                update(ref(db), updates)
            } else {
                console.log("sending declined email")
                sendEmailOnDecision(props.data, claimerEmail, props.ownerEmail, false)
                // mark as unclaimed (reset user_id field) to put listing back up on marketplace
                const updates : {[key: string] : string} = {}
                updates['/products/' + props.listingID + "/user_id"] = "";
                update(ref(db), updates)
            }
        } else {
            console.log("ERROR sending acceptance email: email undefined")
        }
    }




    // TODO: convert date to Jan 1 - Dec 31 instead of full dates?
    // TODO: redirect to product page onclick
    // TODO: tags?
    return (
        <div className="listing-wrapper">
            <div className="listing-image">
                <img src={img} className="listing-image" alt="Listing"/>
            </div>
            <div className="listing-info">
                <h4 id="address">{props.data.address}</h4>
                <p>Available {props.data.date_start} to {props.data.date_end}</p>
                <p>{props.data.area} sqft.</p>
                <p>${props.data.price}/day</p>
            </div>

            { props.data.user_id !== "" && props.showClaimedBox && // only render claimer and accept/decline for claimed listings
                <div className="claimed-box">
                    <div className="claiming-user-info">
                        <p>Claimed by</p>
                        <h4>{claimerName}</h4>
                        <p>{claimerEmail}</p>
                        <p>{claimerPhone}</p>
                    </div>

                    { props.showAcceptDecline &&
                        <div className="accept-decline-wrapper">
                            <div onClick={e => onClickDecision(e, true)}>Accept</div>
                            <div onClick={e => onClickDecision(e, false)}>Decline</div>
                        </div>
                    }
                </div>
            }

        </div>
    );
}

export default Listing;