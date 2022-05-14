import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import React from "react";
import {ListingData} from "./Listing";
import {getDatabase, onValue, ref as dbRef} from "firebase/database";
import {useNavigate} from "react-router-dom";

// returns PROMISE for an image URL string (which can be used as "src" for <img>)
//  since returns a promise, can be used as follows:

//   const loadImageFunc = async () = {
//         const result = await getImageSrc("product1/img1")
//         console.log(result)
//         setImage(result)
//         ...
//   }
export const getImageSrc = async (relativeURL: string) => {
    const storage = getStorage()
    // return a promise once the image has been successfully retrieved
    return await getDownloadURL(ref(storage, relativeURL))
}

// TODO: change first argument if necessary, but ensure that e has e.target.files
// example save path: "product5/img1", "product5/img2", ...
export const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, relativeSavePath: string) => {
    console.log("uploading")

    // get array of files (should only be size 1 because <input type="file"> gives popup that only accepts 1 file
    const files: File[] = Array.from(e.target.files!)
    console.log("files to upload: ", files)

    // only upload if a file is selected
    if (files.length === 1) {
        // Get a reference to the storage
        const storage = getStorage();
        // Create a reference to the listing's image location (will create if doesn't already exist)
        const listingRef = ref(storage, relativeSavePath)
        // 'file' comes from the Blob or File API
        await uploadBytes(listingRef, files[0]).then((snapshot) => {
            console.log('Uploaded file!');
        });
    } else {
        console.log("No image selected!")
    }
}

// converts raw Date objects to date strings of the format "MMM DD" (e.g. Jan 1, Dec 31)
export const getMonthDate = (date: Date): string => {
    const options = {
        month: 'short',
        day: 'numeric'
    } as const
    return date.toLocaleDateString('en-us', options)
}

// converts raw Date to string date of form "mm/dd/yyyy"
export const getFullDate = (date: Date): string => {
    const options = {
        year: "numeric",
        month: '2-digit',
        day: '2-digit'
    } as const
    return date.toLocaleDateString('en-us', options)
}

// converts raw Date to string date of form "yyyy-mm-dd": required format for backend
export const getFullDateHyphens = (date: Date): string => {
    const options = {
        year: "numeric",
        month: '2-digit',
        day: '2-digit'
    } as const
    const dateString = date.toLocaleDateString('en-us', options).replace(/\//g, '-')
    const x: string[] = dateString.split("-")
    console.log(x)
    const y = x[2] + "-" + x[0] + "-" + x[1]
    // console.log("before reverse")
    // console.log(y)
    // console.log("after reverse")
    // console.log(date.toLocaleDateString('en-us', options).replace(/\//g, '-').split('/').reverse().join('/'))

    return y
}


// send email when owner accepts/declines a claim
export const sendEmailOnDecision = (listingData: ListingData, userEmail: string, ownerEmail: string | null, listingAccepted: boolean) => {
    if(ownerEmail != null) {
    
        const dataToSend = {
            accepted: listingAccepted,
            key1 : listingData,
            user_email: userEmail,
            owner_email: ownerEmail
        }

        // make POST request to email endpoint
        fetch('http://localhost:4567/emailUserOnDecision', {
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
            .catch((error) => {
                console.log("JSON error while sending email notification");
            })
    }
}

// send email when claimer cancels their claim
export const sendEmailOnUnclaim = (listingData: ListingData, claimerEmail: string, ownerEmail: string | null) => {
    if(ownerEmail != null) {
        const dataToSend = {
            key1 : listingData,
            user_email: claimerEmail,
            owner_email: ownerEmail
        }

        // make POST request to email endpoint
        fetch('http://localhost:4567/emailOwnerOnUnclaim', {
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
            .catch((error) => {
                console.log("JSON error while sending email notification");
            })
    }
}


export const checkUserAddressIsValid = async (userID: string, navigateTo: any) => {
    // use UserID to fetch address from DB
    console.log("checking address validity for user:")
    console.log(userID)
    const db = getDatabase()
    const addressRef = dbRef(db, `users/${userID}/address`)
    onValue(addressRef, (data) => {
        const address = data.val()
        console.log("checking address:")
        console.log( address)
        if (address === "") {
            console.log("NULL ADDRESS")
            navigateTo("/profile")
        }
    })
}