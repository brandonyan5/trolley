import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Button} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {getImageSrc} from "../SharedComponents/UtilFunctions";
import {UserData} from "../Profile/ProfilePage"
import OwnerView from "./OwnerView"


import './products.css'

function UserView() {

    // Firebase consts
    const auth = getAuth()

    // Constants for accessing info from state passed
    const location = useLocation();
    const state = location.state as {[key:string] : ListingData | string}
    const listingData = state.product as ListingData
    const listingName = state.listingName  as string

    // state for keeping track of user's info
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    // Hooks for showing image
    const [img, setImg] = useState("");

    

    const loadImg = async (relativeImgURL: string) => {
        // resolve promise by only updating img AFTER the promise is returned from getImageSrc
        const res = await getImageSrc(relativeImgURL)
        setImg(res)
    }

    // load image once upon initial rendering of listing
    useEffect(() => {
        // path to image is in the format "product<number>/img<number>"
        loadImg(`${listingName}/img1`)
    }, [listingName])

    // reload content once user auth is satisfied
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                readProfile()
            }
        });
    }, [])

    const updateListing = () => {
        // get reference to db
        const db = getDatabase()

        // declare update type and get current user
        const updates : {[change : string] : string | null }= {};
        const user  = auth.currentUser

        // update the user id
        updates['/products/' + listingName + '/user_id'] = user!.uid;

        // update the users claims
        updates['/users/'+ user!.uid +"/claims/" + listingName] = listingName

        // send changes to firebase
        update(ref(db), updates);  
    }

    // read owners's profile from firebase to get contact info
    const readProfile = () => {
        
        // get reference to db
        const db = getDatabase()

        console.log(listingData)

        const userRef = ref(db, 'users/' + listingData.owner_id);

        // Check if entry exists in database, if not, add them
        onValue(userRef, (snapshot) => {
            const data : UserData = snapshot.val();
            console.log(data)
            setEmail(data.email)
            setPhone(data.phone)
            setName(data.name)
        },
        {
            onlyOnce: true
        });
    }

    // api to send email
    const sendEmail = () => {

        const user  = auth.currentUser

        const dataToSend = {
            key1 : listingData,
            user_email: user?.email,
            owner_email: email
        }

        console.log(dataToSend)

        // make POST request to endpoint
        fetch('http://localhost:4567/emailOwnerOnClaim', {
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

    

    
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        console.log('why')
        if (!user) {
            navigateTo("/login")
        } 

    });


    return (
        <div className = "product-screen">
            <NavBar />
            <Container fluid={true} >
            <Row  className = "row g-0">
                <Col md = {6} xs = {12}  className="p-3">
                    <div className = "product-content">
                        <div className = "product-info">
                            <Icon  icon="iconoir:profile-circled" className = "dolly" color="dark blue" width='50px'/>
                            {name}
                        </div>

                        <div className = "product-info">
                            <Icon  icon="bx:map"  className = "dolly" color="dark blue" width='50px'/>
                            {listingData.address}
                        </div>
                        <div className = "product-info">
                            <Icon  icon="radix-icons:dimensions" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            {listingData.area} sqft
                        </div>
                        <div className = "product-info">
                            <Icon   icon="dashicons:money-alt" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            ${listingData.price}/day
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Availability
                            </div>
                            <div>
                                {listingData.date_start} -- {listingData.date_end}
                            </div>
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Contact
                            </div>
                            <div>
                                <Icon  icon="akar-icons:phone" color="dark blue" className = "dolly" width='40px'/>
                                {phone} 
                            </div>
                            <div>
                                <Icon  icon="ant-design:mail-outlined" color="dark blue" className = "dolly" width='40px'/>
                                {email}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md = {6} xs = {12} className="p-3" >
                    <Row className = "row g-0">
                    <div className = "image-view">
                            <img src={img} className="product-image" alt="Listing"/>
                        </div>
                    </Row>
                    <Row className = "row g-0">
                        <div className = "claim-box">
                            <Button variant="primary" onClick = {() => {updateListing(); sendEmail()}}>Claim</Button>{' '}
                        </div>
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    );
}

export default UserView;