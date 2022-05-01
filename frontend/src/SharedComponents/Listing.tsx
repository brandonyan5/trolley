import React, {useEffect, useState} from 'react';
import {getImageSrc} from "./UtilFunctions";
import "../SharedComponents/Listing.css"

// Type for the JSON data of a single listing = map from string -> string (field name -> field value)
export type ListingData = {
    address: string
    area: string
    date_start: string
    date_end: string
    price: string
    owner_email: string
    user_email: string
}

interface ListingProps {
    listingName: string,
    data: ListingData,
    isClaimed: boolean,
}

function Listing(props: ListingProps) {
    const [img, setImg] = useState("");

    const loadImg = async (relativeImgURL: string) => {
        // resolve promise by only updating img AFTER the promise is returned from getImageSrc
        const res = await getImageSrc(relativeImgURL)
        setImg(res)
    }

    // load image once upon initial rendering of listing
    useEffect(() => {
        // path to image is in the format "product<number>/img<number>"
        loadImg(`${props.listingName}/img1`)
    }, [props.listingName])


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
                <p>{props.data.date_start} - {props.data.date_end}</p>
                <p>{props.data.area} sqft.</p>
                <p>${props.data.price}/day</p>
            </div>

        </div>
    );
}

export default Listing;