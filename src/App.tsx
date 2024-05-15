import React, {useContext} from 'react';
import './App.css';
import { useState, useEffect } from "react";
import Map from "./pages/Map";
import Home from "./pages/Home"
//import Contacts from "./pages/Contacts"
import Header from "./components/Header";
import About from "./pages/About";
import PublicatedTrips from "./pages/PublicatedTrips";
import AdminPanel from "./pages/admin-panel";
import Profile from "./pages/Profile";
import { RequireAuth } from "./hoc/RequireAuth";
import {Routes, Route, useLocation, Link, Navigate} from "react-router-dom"


import * as AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./login-register/Login";
import Register from "./login-register/Register";


import EventBus from "./common/EventBus";
import {AuthContext} from "./hoc/AuthProvider";

const App: React.FC = () => {
    const [showHeader, setShowHeader] = useState<boolean>(true);
    const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
    const { isAdmin } = useContext(AuthContext);
    console.log(isAdmin);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/registration') {
            setShowHeader(false);
        } else {
            setShowHeader(true);
        }

        if (user) {
            setCurrentUser(user);
        }

        EventBus.on("logout", logOut);

        return () => {
            EventBus.remove("logout", logOut);
        };
    }, []);

    const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    };



    return (
        <div>
            <Header />
            <Routes>
                {isAdmin ? (
                    <Route path="/admin" element={<AdminPanel />} />
                ) : (
                    // Если не администратор, перенаправляем на страницу профиля
                    <Route path="/admin" element={<Navigate to="/profile" />} />
                )}
                <Route path="/about" element={<About />} />
                <Route path="/publicatedtrips" element={<PublicatedTrips />} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/" element={<Home />} />
                
                <Route path="/map/:tripId" element={<RequireAuth><Map /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Register />} />
            </Routes>
        </div>
    );
}


export default App;
