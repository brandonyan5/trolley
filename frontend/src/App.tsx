import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import "./App.css";
import { LoginPage } from "./Login/LoginPage";
import Marketplace from "./Marketplace/Marketplace";
import Error from "./SharedComponents/Error";
import ListingsPage from "./Listings/ListingsPage";
import ClaimsPage from "./Claims/ClaimsPage";
import ProfilePage from "./Profile/ProfilePage";
import UserView from "./ProductPages/UserView";
import OwnerView from "./ProductPages/OwnerView";


function App() {
    // // keep track of logged in state
    // const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

    

    return (
        <Router>
            <Routes>
                {/* Define all routes (pages) in the app here and declare what page component should be rendered */}
                <Route path="/" element={<Marketplace />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/home" element={<Marketplace />}/>
                <Route path="/listings" element={<ListingsPage />}/>
                <Route path="/claims" element={<ClaimsPage />}/>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/products" element={<UserView />}/>
                <Route path="/createlisting" element={<OwnerView />}/>
                <Route path="*" element={<Error />}/>
            </Routes>
        </Router>
    );
}

export default App;
