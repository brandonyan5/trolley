import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../SharedComponents/NavBar' 
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { ListingData } from '../SharedComponents/Listing';
import {Row, Col, Container, Button} from "react-bootstrap"
import { Icon } from '@iconify/react';
import {getImageSrc} from "../SharedComponents/UtilFunctions";



import './products.css'

interface UserViewProps {
    // possible props to consider: listing_id
    listing_id : string
}


function UserView() {

    // Constants for accessing info from state passed
    const location = useLocation();
    const state = location.state as {[key:string] : ListingData}

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
        loadImg(`${state.listingName}/img1`)
    }, [state.listingName])

    const updateListing = () => {
        // get reference to db
        const db = getDatabase()

        // declare update type and get current user
        const updates : {[change : string] : string | null }= {};
        const user  = auth.currentUser

        // update the email
        updates['/products/' + state.listingName + '/user_email'] = user!.email;

        // send changes to firebase
        update(ref(db), updates);  
    }

    

    // Firebase consts
    const auth = getAuth()
    const db = getDatabase();
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
                            {state.product.owner_email} (name instead)
                        </div>

                        <div className = "product-info">
                            <Icon  icon="bx:map"  className = "dolly" color="dark blue" width='50px'/>
                            {state.product.address}
                        </div>
                        <div className = "product-info">
                            <Icon  icon="radix-icons:dimensions" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            {state.product.area} sqft
                        </div>
                        <div className = "product-info">
                            <Icon   icon="dashicons:money-alt" color="dark blue" rotate={2} className = "dolly" width='50px'/>
                            ${state.product.price}/day
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Availability
                            </div>
                            <div>
                                {state.product.date_start} -- {state.product.date_end}
                            </div>
                        </div>
                        <div>
                            <div className = "product-descriptors">
                                Contact
                            </div>
                            <div>
                                <Icon  icon="akar-icons:phone" color="dark blue" className = "dolly" width='40px'/>
                                {state.product.owner_email} (number instead)
                            </div>
                            <div>
                                <Icon  icon="ant-design:mail-outlined" color="dark blue" className = "dolly" width='40px'/>
                                {state.product.owner_email}
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
                            <Button variant="primary" onClick = {updateListing}>Claim</Button>{' '}
                        </div>
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    );
}

export default UserView;