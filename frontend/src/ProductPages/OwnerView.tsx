import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Form, Button} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {uploadImage} from "../SharedComponents/UtilFunctions";
import { UserData }from "../Profile/ProfilePage"


import './products.css'

function OwnerView() {

    // Firebase states
    const auth = getAuth()

    // state for keeping track of image
    const [img, setImg] = useState("");

    // Const for accessing info from location state

    const location  = useLocation()
    const state = location.state as {[key:string] : string | ListingData}


    // Check for claims for this listing
    useEffect(() => {
        getUserClaim()
    }, []);



    const listingData = state.listingData as ListingData

    // states for editability and keeping track of listing properties
    const [editable, setEditable] = useState(listingData.user_id != "")
    const [address, setAddress] = useState(listingData.address)
    const [area, setArea] = useState(listingData.area)
    const [dateStart, setDateStart] = useState(listingData.date_start)
    const [dateEnd, setDateEnd] = useState(listingData.date_end)
    const [price, setPrice] = useState(listingData.price)
    const [userName, setUserName] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const listingID = state.listingID as string

    // Post updates
    const postListing  = () => {

        const user = auth.currentUser
        const db = getDatabase()

        const updates : {[key: string] : string|boolean} = {}

        updates['/users/' + user?.uid + "/listings/" + listingID] = listingID;
        updates['/products/' + listingID + "/address"] = address;
        updates['/products/' + listingID + "/date_start"] = dateStart;
        updates['/products/' + listingID + "/date_end"] = dateEnd;
        updates['/products/' + listingID + "/area"] = area;
        updates['/products/' + listingID + "/price"] = price;

        update(ref(db), updates)

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
            return response.json();
        })
        .catch((error) => {
            console.log("JSON error while sending email notification");
        })
    }

    // access profile info of claimer if it exists
    const getUserClaim = () => {
        if(listingData.user_id != "") {

            // get database
            const db = getDatabase()

            // Get firebase const info
            const userRef = ref(db, 'users/' + listingData.user_id);

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
        uploadImage(e, `${listingID}/img1`)
    }

    return (
        <div>
            <NavBar />
            <Container fluid={true} >
                <Row  className = "row g-0">
                <Col md = {6} xs = {12}  className="p-3">
                    <div className = "product-content">
                    <Form>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon  icon="bx:map"  className = "dolly" color="dark blue" width='50px'/>
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control type="text" placeholder="Address" defaultValue = {address} onChange={(e) => setAddress(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon  icon="radix-icons:dimensions" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            </Form.Label>
                            <Col sm={10}>   
                            <Form.Control type="text" placeholder="Area" defaultValue = {area} onChange={(e) => setArea(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon icon="dashicons:money-alt" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control type="text" placeholder="Price per day" defaultValue={price} onChange={(e) => setPrice(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm={2}>
                            <Icon icon="bi:calendar-date-fill" color="#031c34" rotate={2} hFlip={true} vFlip={true} className = "dolly" width='50px' />
                            </Form.Label>
                            <Col xs={5} sm={4}>
                            <Form.Control type="text" placeholder="Start date" defaultValue={dateStart} onChange={(e) => setDateStart(e.target.value)}/>
                            </Col> to
                            <Col xs={5} sm={4}>
                            <Form.Control type="text" placeholder="End date" defaultValue  = {dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
                            </Col>
                        </Form.Group>
                    </Form>
                    </div>
                </Col>
                <Col md = {6} xs = {12} className="p-3" >
                    <Row className = "row g-0">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Default file input example</Form.Label>
                            <Form.Control type="file" onChange = {(e) => uploadImg(e as any)}/>
                        </Form.Group>
                    </Row>
                    <Row className = "row g-0">
                        <div className = "claim-box">
                            <Button variant="primary" onClick={postListing}>Post Listing</Button>
                        </div>
                    </Row>
                    <Row className = "row g-0">
                        <div className = "claim-box">
                            {(userName != "") && 
                            <div>
                                <div>{userName}</div>
                                <Button variant="primary" onClick = {() => sendEmail(true)}>Accept</Button>
                                <Button variant="danger" onClick = {() => sendEmail(false)}>Decline</Button>
                            </div>}

                        </div>
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )

}

export default OwnerView