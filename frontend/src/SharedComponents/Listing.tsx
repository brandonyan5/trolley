import React, {useEffect, useState} from 'react';
import {getImageSrc} from "./UtilFunctions";
import "../SharedComponents/Listing.css"
import {getDatabase, onValue, ref} from "firebase/database";
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
    listingName: string,
    data: ListingData,
    showClaimedBox: boolean,
    showAcceptDecline: boolean
}

function Listing(props: ListingProps) {
    const [img, setImg] = useState("");
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPhone, setUserPhone] = useState<string>("");

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
                setUserName(data.name)
                setUserEmail(data.email)
                setUserPhone(data.phone)
            },
            {
                onlyOnce: true
            })
    }

    // load image once upon initial rendering of listing
    useEffect(() => {
        // path to image is in the format "product<number>/img<number>"
        loadImg(`${props.listingName}/img1`)
    }, [props.listingName])

    // get detail of claimers (if any)
    useEffect(() => {
        if(props.data.user_id != "") {
            getUserClaim()
        }
        }, [props.data.user_id]);


    /* Event handlers */
    const onClickAccept = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("accept")
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
                        <h4>{userName}</h4>
                        <p>{userEmail}</p>
                        <p>{userPhone}</p>
                    </div>

                    { props.showAcceptDecline &&
                        <div className="accept-decline-wrapper">
                            <div onClick={onClickAccept}>Accept</div>
                            <div>Decline</div>
                        </div>
                    }
                </div>
            }

        </div>
    );
}

export default Listing;