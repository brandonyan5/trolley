import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { Card, Button, Form, Col, Row} from 'react-bootstrap';
import { Icon } from '@iconify/react';


interface ProfilePageProps {
    // isLoggedIn: boolean
}

function ProfilePage(props: ProfilePageProps) {

    const auth = getAuth()
    // redirect to login page if user is not already logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }

    });

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
                                    <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                    Address
                                    </Form.Label>
                                    <Col sm={10}>
                                    <Form.Control type="text" placeholder="Address" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                    Phone
                                    </Form.Label>
                                    <Col sm={10}>
                                    <Form.Control type="text" placeholder="Phone Number" />
                                    </Col>
                                </Form.Group>
                                <fieldset>
                                    <Form.Group as={Row} className="mb-3">
                                    <Form.Label as="legend" column sm={2}>
                                        Radios
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Check
                                        type="checkbox"
                                        label="Share email"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        />
                                        <Form.Check
                                        type="checkbox"
                                        label="Share phone number"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        />
                                    </Col>
                                    </Form.Group>
                                </fieldset>
                            </Form>
                            <Button variant="primary">Update Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>
             </Row>
        </div>
    );
}

export default ProfilePage;