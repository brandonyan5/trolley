import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue,push, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Form, Button, Alert} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {checkUserAddressIsValid, uploadImage} from "../SharedComponents/UtilFunctions";
import { UserData }from "../Profile/ProfilePage"
import {getImageSrc} from "../SharedComponents/UtilFunctions";
import {sendEmailOnDecision} from "../SharedComponents/UtilFunctions"
import {addressestoDistance} from "../Haversine/haversine";



import './products.css'

function OwnerView() {

    // const for navigation
    const navigateTo = useNavigate()

    // Firebase states
    const auth = getAuth()

    // state for keeping track of image
    const [img, setImg] = useState("");

    // Const for accessing info from location state

    const location  = useLocation()
    const state = location.state as {[key:string] : string}

    const [listingID, setListingID] = useState(state.listingID);

    // states for editability and keeping track of listing properties
    const [address, setAddress] = useState("")
    const [area, setArea] = useState("")
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [price, setPrice] = useState("")
    const [userName, setUserName] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userID, setUserID] = useState("")
    const [completed, setCompleted] = useState<boolean>(false)
    const [listingData, setListingData] = useState({} as ListingData);
    const [imageSelected, setImageSelected] = useState(false)

    const [listingText, setListingText] = useState("Post Listing")
    const [imageUploadEvent, setImageUploadEvent] = useState<React.ChangeEvent<HTMLInputElement>>()


    // states for alerts
    const [showDecisionAlert, setShowDecisionAlert] = useState(false)

    // Check for images
    useEffect(() => {
        console.log("here1")
        if(address != "") {
            loadImg(`${listingID}/img1`)
            setImageSelected(true)
        }
    }, [listingData]);

    // Check for claims for this listing
    useEffect(() => {
        if (userID !== "") {
            getUserClaim()
        }
    }, [userID]);

    // functions for updating price and area
    
    // update price
    const updatePrice = (newPrice : string ) => {
        const maxPrice = "10"
        const minPrice = "0"
        if(parseInt(newPrice) > 10) {
            newPrice = maxPrice
        }
        else if(parseInt(newPrice) < 0) {
            newPrice = minPrice
        }
        setPrice(newPrice)
    }

    // update area
    const updateArea = (newArea : string ) => {
        const maxArea = "200"
        const minArea = "1"
        if(parseInt(newArea) > 200) {
            newArea = maxArea
        }
        else if(parseInt(newArea) < 1) {
            newArea = minArea
        }
        setArea(newArea)
    }

    // Post updates
    const postListing  = async () => {

        const user = auth.currentUser
        const db = getDatabase()

        const updates : {[key: string] : string|boolean} = {}
        console.log("here")

        if(listingID != "invalid") {
            await addressestoDistance(address, "69 Brown St").then(dist => {
                if (dist !== "ERROR") {

                    updates['/users/' + user?.uid + "/listings/" + listingID] = listingID;
                    updates['/products/' + listingID + "/address"] = address;
                    updates['/products/' + listingID + "/date_start"] = dateStart;
                    updates['/products/' + listingID + "/date_end"] = dateEnd;
                    updates['/products/' + listingID + "/area"] = area;
                    updates['/products/' + listingID + "/price"] = price;

                    update(ref(db), updates)

                    navigateTo("/listings")
                    
                    
                } else {
                    console.log("invalid entry")
                }   

            })
        } 
        else {

            await addressestoDistance(address, "69 Brown St").then(async dist => {
                if (dist !== "ERROR") {
                    const listingsRef = ref(db, "products")

                    // define the new listing data
                    const emptyListingData = {
                        address: address,
                        area: area,
                        completed: completed, 
                        date_end: dateEnd,
                        date_start: dateStart,
                        owner_id: auth.currentUser?.uid,
                        price: price,
                        user_id: ""

                    }

                    // Generate a reference to a new location and add some data using push()
                    const newPostRef = push(listingsRef, emptyListingData)
                    setListingID(newPostRef.key as string)


                    await uploadImage(imageUploadEvent as React.ChangeEvent<HTMLInputElement>, `${newPostRef.key}/img1`)
                    navigateTo("/listings")
                } 

                else {
                    console.log("invalid entry")
                }   
    
            })

        }  

    }

    // set image if loaded
    const loadImg = async (relativeImgURL: string) => {
        // resolve promise by only updating img AFTER the promise is returned from getImageSrc
        const res = await getImageSrc(relativeImgURL)
        setImg(res)
    }

    // api to send email
     // api to send email
     const sendEmail = (accepted: boolean) => {

        const user  = auth.currentUser

        const dataToSend = {
            accepted: accepted,
            key1 : listingData,
            user_email: userEmail,
            owner_email: user?.email
        }

        // make POST request to endpoint
        // temp comment
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
            markListingAsComplete(accepted)
        })
        .catch((error) => {
            console.log("JSON error while sending email notification");
        })
    }

    // Post updates
    const markListingAsComplete  = (completed: boolean) => {

        setCompleted(completed)

        const user = auth.currentUser
        const db = getDatabase()

        const updates : {[key: string] : string|boolean} = {}

        updates['/products/' + listingID + "/completed"] = completed;
        if(!completed) {
            updates['/products/' + listingID + "/user_id"] = "";
            setUserName("")
            setUserEmail("")
            setUserPhone("")
            setUserID("")
        }

        setShowDecisionAlert(true)

        update(ref(db), updates)

    }


    const getListingData = () => {
        const db = getDatabase()
        const userRef = ref(db, `products/${listingID}`);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data: ListingData = snapshot.val();
                setAddress(data.address)
                setArea(data.area)
                setCompleted(data.completed)
                setDateEnd(data.date_end)
                setDateStart(data.date_start)
                setPrice(data.price)
                setUserID(data.user_id as string)
                setListingData(data)
                setListingText("Update Listing")
            }
        })
    }

    useEffect(() => {
        getListingData()
    }, []);


    // access profile info of claimer if it exists
    const getUserClaim = () => {
        if(userID != "") {

            // get database
            const db = getDatabase()

            // Get firebase const info
            const userRef = ref(db, 'users/' + userID);

            // Get info of the claimer of this listing
            onValue(userRef, (snapshot) => {
                const data : UserData = snapshot.val();
                setUserName(data.name)
                setUserEmail(data.email)
                setUserPhone(data.phone)
                
            },
            {
                onlyOnce: true
            });
        }
    }


    // upload image the user selects

    const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(listingID != "invalid") {
            uploadImage(e, `${listingID}/img1`)
            console.log("here95")
        }
        setImageUploadEvent(e)
        setImageSelected(true)
    }

    return (
        <div>
            <NavBar />
            <Alert className = "decision-alert"
                    show = {showDecisionAlert} 
                    key={"success"} 
                    variant={"success"}
                    onClose={() => setShowDecisionAlert(false)}
                     dismissible>
                 Your decision has been sent!
            </Alert>
            <Container fluid={true} >
                <Row  className = "row g-0">
                <Col md = {6} xs = {12}  className="p-3">
                    <div className = "product-content">
                    <Form>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon  icon="bx:map"  className = "dolly" color="dark blue" width='50px'/>
                            </Form.Label>
                            <Col sm={10} className = "col-with-margins">
                            <Form.Control type="text" placeholder="Address" defaultValue = {address} disabled = {userID !== ""} onChange={(e) => setAddress(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon  icon="radix-icons:dimensions" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            </Form.Label>
                            <Col sm={10} className = "col-with-margins">   
                            <Form.Control type="text" placeholder="Area (0 to 200)" value = {area} disabled = {userID !== ""} onChange={(e) => updateArea(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon icon="dashicons:money-alt" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            </Form.Label>
                            <Col sm={10} className = "col-with-margins">
                            <Form.Control type="text" placeholder="Price per day ($0.5 to $10)" value={price} disabled = {userID !== ""} onChange={(e) => updatePrice(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon icon="bi:calendar-date-fill" color="#031c34" rotate={2} hFlip={true} vFlip={true} className = "dolly" width='50px' />
                            </Form.Label>
                            <Col xs={5} sm={4} className = "col-with-margins">
                            <Form.Control type="text" placeholder="Start date" defaultValue={dateStart} disabled = {userID !== ""} onChange={(e) => setDateStart(e.target.value)}/>
                            </Col> 
                            <Col xs={5} sm={4} className = "col-with-margins">
                            <Form.Control type="text" placeholder="End date" defaultValue  = {dateEnd} disabled = {userID !== ""} onChange={(e) => setDateEnd(e.target.value)}/>
                            </Col>
                        </Form.Group>
                    </Form>
                    </div>
                </Col>
                <Col md = {6} xs = {12} className="p-3" >
                    <Row className = "row g-0">
                        {img == "" ?
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Choose Image</Form.Label>
                            <Form.Control type="file" onChange = {(e) => uploadImg(e as any)}/>
                        </Form.Group>
                        :
                        <div className = "image-view">
                            <img src={img} className="product-image" alt="Listing"/>
                        </div>
                        }                   
                    </Row>
                    <Row className = "row g-0">
                        {userID === "" &&
                            <div className = "claim-box">
                                <Button variant="primary" onClick={postListing} disabled = {(price=="" || area =="" || !imageSelected)}>
                                    {listingText}
                                </Button>
                            </div>
                        }
                    </Row>
                    {(userName != "") && 
                    <Row className = "row g-0">
                        <div className = "claim-box">
                            
                            <div>
                                <div>{userName}</div>
                                {(!completed) &&
                                <div>
                                    <Button variant="primary" onClick = {() => {sendEmailOnDecision(listingData, userEmail, auth.currentUser!.email, true); markListingAsComplete(true)}}>Accept</Button>
                                    <Button variant="danger" onClick = {() => {sendEmailOnDecision(listingData, userEmail, auth.currentUser!.email, false); markListingAsComplete(false)}}>Decline</Button>
                                </div>
                                }
                            </div>

                        </div>
                    </Row>}
                </Col>
            </Row>
            </Container>
        </div>
    )

}

export default OwnerView