import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { Card, Button, Form, Col, Row} from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import {ListingData} from "../SharedComponents/Listing";
import {addressestoDistance} from "../Haversine/haversine";


// Type for the data of a single user
export type UserData = {
    address: string
    claims: string
    email: string
    listings: string
    name: string
    phone: string
    show_email: boolean
    show_phone: boolean
}

interface ProfilePageProps {
    // isLoggedIn: boolean
}

function ProfilePage(props: ProfilePageProps) {


    // Hooks for email, address, phone number, and privacy settings
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [showEmail, setShowEmail] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [validUpdate, setValidUpdate] = useState(true)

    // Firebase consts
    const auth = getAuth()
    const db = getDatabase();
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        } 

    });

    //get user info  data and start listener once when profile page is initially rendered
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                readUserData()
            }
        });
    }, [])

    /**
     * Reads in the user's personal info stored in the database to properly
     * render their attributes in the profile page
     */
    function readUserData() {
        
        // Get firebase const info
        const user = auth.currentUser
        const userRef = ref(db, 'users/' + user!.uid);

        // Check if entry exists in database, if not, add them
        onValue(userRef, (snapshot) => {
            const data : UserData = snapshot.val();
            setHooks(data)
        },
        {
            onlyOnce: true
        });
    }

    /**
     * Sets the hooks to their appropriate values based on the user's information 
     * in the database. 
     */
    function setHooks(data: UserData) {
        setEmail(data.email)
        setAddress(data.address)
        setPhone(data.phone)
        setShowEmail(data.show_email)
        setShowPhone(data.show_phone)

    }

    // update email and phone preferences
    const updateEmail = () => {
        if(showPhone) {
            setShowEmail(!showEmail)
        }
    }

    const updatePhone = () => {
        if(showEmail) {
            setShowPhone(!showPhone)
            checkValidUpdate()
        }
    }

    const checkValidUpdate = () => {
        if(showPhone) {
            if(phone.length >= 10) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }


    /**
     * Update the profile of the user based on changes made
     */
    const updateProfile = async () => {
        // Write the new post's data simultaneously in the posts list and the user's post list.
        
        const updates : {[change : string] : string | boolean}= {};
        const user  = auth.currentUser

        await addressestoDistance(address, "69 Brown St").then(dist => {
            if(dist !== "ERROR") {
                updates['/users/' + user!.uid +'/address'] = address;
                updates['/users/' + user!.uid +'/phone'] = phone;
                updates['/users/' + user!.uid +'/show_email'] = showEmail;
                updates['/users/' + user!.uid +'/show_phone'] = showPhone;

                update(ref(db), updates); 

                navigateTo("/home")
            } 
            else {
                console.log("Invalid address")
            }
        })
    }
    return (
        <div>
            <NavBar />
            
            <Row className="row g-0">
                <Col xl = {6}>
                    <Card  >
                        <Card.Body>
                            <Card.Title>My Profile</Card.Title>
                            <Form>
                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                    <Form.Label column sm={2}>
                                    Email
                                    </Form.Label>
                                    <Col sm={10}>
                                    <Form.Control plaintext readOnly defaultValue= {email} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                    Address
                                    </Form.Label>
                                    <Col sm={10}>
                                    <Form.Control type="text" placeholder="Address" value  = {address} onChange={(e) => {setAddress(e.target.value); console.log(e.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                    Phone
                                    </Form.Label>
                                    <Col sm={10}>
                                    <Form.Control type="text" placeholder="Phone Number" value  = {phone} onChange={(e) => {setPhone(e.target.value); console.log("here"); checkValidUpdate()}}/>
                                    </Col>
                                </Form.Group>
                                <fieldset>
                                    <Form.Group as={Row} className="mb-3">
                                    <Form.Label as="legend" column sm={2}>
                                        Contact Information
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Check
                                        type="checkbox"
                                        label="Share email"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        onChange={(e) => updateEmail()}
                                        checked={showEmail}
                                        />
                                        <Form.Check
                                        type="checkbox"
                                        label="Share phone number"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        onChange={(e) => updatePhone()}
                                        checked={showPhone}
                                        />
                                    </Col>
                                    </Form.Group>
                                </fieldset>
                            </Form>
                            <Button variant="primary" disabled  = {!checkValidUpdate() || address == ""} onClick = {() => updateProfile()} >Update Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> 
        </div>
    );
}

export default ProfilePage;