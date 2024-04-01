import React from 'react';
import './App.css';
import Map from "./pages/Map";
import Home from "./pages/Home"
import Contacts from "./pages/Contacts"
import Header from "./components/Header";
import { Login } from "./pages/Login";
import { RequireAuth } from "./hoc/RequireAuth";
import { Routes, Route, useLocation } from "react-router-dom"
import {AuthProvider} from "./hoc/AuthProvider";
import SignInComponent from "./pages/Registration";


function App() {
    const location = useLocation();
    const showHeader = !['/login'].includes(location.pathname);



    return (
        <div>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/map" element={<RequireAuth><Map /></RequireAuth>} />
                <Route path="/login" element={<Login />} />

            </Routes>
        </div>
    );
}

export default App;
