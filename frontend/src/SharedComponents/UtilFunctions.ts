import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import React from "react";

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
export const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, relativeSavePath: string) => {
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
        uploadBytes(listingRef, files[0]).then((snapshot) => {
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