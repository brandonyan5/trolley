import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import "./App.css";
import LoginPage from "./Login/LoginPage";
import Marketplace from "./Marketplace/Marketplace";
import NavBar from "./SharedComponents/NavBar";
import Error from "./SharedComponents/Error";
import ListingsPage from "./Listings/ListingsPage";
import ClaimsPage from "./Claims/ClaimsPage";
import ProfilePage from "./Profile/ProfilePage";

function App() {
    // keep track of logged in state
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

    return (
        <Router>
            {isLoggedIn && //only render nav bar when user is logged in (note: shows navbar on ALL pages when logged in)
                <NavBar setLoggedIn={setLoggedIn}/>
            }

            <Routes>
                {/* Define all routes (pages) in the app here and declare what page component should be rendered */}
                <Route path="/" element={<Marketplace isLoggedIn={isLoggedIn}/>}/>
                <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn}/>}/>
                <Route path="/home" element={<Marketplace isLoggedIn={isLoggedIn}/>}/>
                <Route path="/listings" element={<ListingsPage isLoggedIn={isLoggedIn}/>}/>
                <Route path="/claims" element={<ClaimsPage isLoggedIn={isLoggedIn}/>}/>
                <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn}/>}/>
                <Route path="*" element={<Error />}/>
            </Routes>
        </Router>
    );
}

export default App;
