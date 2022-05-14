import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Button, Alert} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {getImageSrc} from "../SharedComponents/UtilFunctions";
import {UserData} from "../Profile/ProfilePage"
import OwnerView from "./OwnerView"


import './products.css'

function UserView() {

    
    // Firebase consts
    const auth = getAuth()

    // Route to login page if not logged in
    const navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        } 

    });


    // Constants for accessing info from state passed
    const location = useLocation();
    const state = location.state as {[key:string] : ListingData | string}
    const listingData = state.product as ListingData
    const listingName = state.listingName  as string

    // state for keeping track of user's info
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [showEmail, setShowEmail] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    // Hooks for showing image
    const [img, setImg] = useState("");

    // states for alerts
    const [showDecisionAlert, setShowDecisionAlert] = useState(false)

    const [displayClaim, setDisplayClaim] = useState(listingData.user_id === "");

    

    const checkIsClaimed = () => {
        const db = getDatabase()
        const listingRef = ref(db, `products/${listingName}`)
        onValue(listingRef, (dataSnapshot) => {
            const listing: ListingData = dataSnapshot.val()
            // get user address
            setDisplayClaim(listing.user_id === "")
        })
    }

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
        checkIsClaimed()
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
            setShowPhone(data.show_phone)
            setShowEmail(data.show_email)
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
            console.log(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error)
            console.log("JSON error while sending email notification");
        })

    }



    return (
        <div className = "product-screen">
            <NavBar />
            <Container fluid={true} >
            <Row  className = "row g-0">
                <Col md = {6} xs = {12}  className="p-3">
                    <div className = "product-content">
                        <div className = "product-info">
                            <Icon  icon="iconoir:profile-circled" className = "dolly" color="#031C34" width='50px'/>
                            <div className = "product-info-text">
                                {name}
                            </div>
                        </div>

                        <div className = "product-info">
                            <Icon  icon="bx:map"  className = "dolly" color="#031C34" width='50px'/>
                            <div className = "product-info-text">
                                {listingData.address}
                            </div>
                        </div>
                        <div className = "product-info">
                            <Icon  icon="radix-icons:dimensions" color="#031C34" rotate={2} className = "dolly" width='50px'/>
                            <div className = "product-info-text">
                                {listingData.area} sqft
                            </div>
                        </div>
                        <div className = "product-info">
                            <Icon   icon="dashicons:money-alt" color="#031C34" rotate={2} className = "dolly" width='50px'/>
                            <div className = "product-info-text">
                                ${listingData.price}/day
                            </div>
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Availability:
                            </div>
                            <div className = "date-text">
                                {listingData.date_start} -- {listingData.date_end}
                            </div>
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Contact:
                            </div>
                            {showPhone &&
                                <div className = "product-info">  
                                    <Icon  icon="akar-icons:phone" color="#031C34" className = "dolly" width='40px'/>
                                    <div className = "product-info-text">{phone} </div>
                                </div>
                            }
                            {showEmail &&
                            <div className = "product-info">
                                <Icon  icon="ant-design:mail-outlined" color="#031C34" className = "dolly" width='40px'/>
                                <div className = "product-info-text">{email} </div>
                            </div>
                            }   
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
                    {listingData.owner_id != auth.currentUser?.uid //makes sure owner is not current viewer
                            && displayClaim && // only display if current user_id for this listing is null (not claimed yet)
                        <div className = "claim-box">
                            
                                <Button className= "claim-button" onClick = {() => {updateListing(); sendEmail()}}>
                                    <div className = "claim-button-text">Claim</div>
                                </Button>
                        </div>
                    }
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    );
}

export default UserView;