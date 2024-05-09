import React from 'react';
import './App.css';
import { useState, useEffect } from "react";
import Map from "./pages/Map";
import Home from "./pages/Home"
import Contacts from "./pages/Contacts"
import Header from "./components/Header";
import About from "./pages/About";
import PublicatedTrips from "./pages/PublicatedTrips";
import Profile from "./pages/Profile";

//import { Login } from "./pages/Login";
import { RequireAuth } from "./hoc/RequireAuth";
import { Routes, Route, useLocation, Link } from "react-router-dom"
import {AuthProvider} from "./hoc/AuthProvider";
import RegistrationPage from "./pages/Registration";


import * as AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./login-register/Login";
import Register from "./login-register/Register";

//import Home from "./components/Home";
//import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import EventBus from "./common/EventBus";

const App: React.FC = () => {
    const [showHeader, setShowHeader] = useState<boolean>(true);
    const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

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
            // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
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
                <Route path="/about" element={<About />} />
                <Route path="/publicatedtrips" element={<PublicatedTrips />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Home />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/map" element={<RequireAuth><Map /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Register />} />
            </Routes>
        </div>
    );
}


//     return (
//         <div>
//             <nav className="navbar navbar-expand navbar-dark bg-dark">
//                 <Link to={"/"} className="navbar-brand">
//                     bezKoder
//                 </Link>
//                 <div className="navbar-nav mr-auto">
//                     <li className="nav-item">
//                         <Link to={"/home"} className="nav-link">
//                             Home
//                         </Link>
//                     </li>
//
//                     {showModeratorBoard && (
//                         <li className="nav-item">
//                             <Link to={"/mod"} className="nav-link">
//                                 Moderator Board
//                             </Link>
//                         </li>
//                     )}
//
//                     {showAdminBoard && (
//                         <li className="nav-item">
//                             <Link to={"/admin"} className="nav-link">
//                                 Admin Board
//                             </Link>
//                         </li>
//                     )}
//
//                     {currentUser && (
//                         <li className="nav-item">
//                             <Link to={"/user"} className="nav-link">
//                                 User
//                             </Link>
//                         </li>
//                     )}
//                 </div>
//
//                 {currentUser ? (
//                     <div className="navbar-nav ml-auto">
//                         <li className="nav-item">
//                             <Link to={"/profile"} className="nav-link">
//                                 {currentUser.username}
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <a href="/login" className="nav-link" onClick={logOut}>
//                                 LogOut
//                             </a>
//                         </li>
//                     </div>
//                 ) : (
//                     <div className="navbar-nav ml-auto">
//                         <li className="nav-item">
//                             <Link to={"/login"} className="nav-link">
//                                 Login
//                             </Link>
//                         </li>
//
//                         <li className="nav-item">
//                             <Link to={"/register"} className="nav-link">
//                                 Sign Up
//                             </Link>
//                         </li>
//                     </div>
//                 )}
//             </nav>
//
//             <div className="container mt-3">
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/home" element={<Home />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/profile" element={<Profile />} />
//                     <Route path="/user" element={<BoardUser />} />
//                     <Route path="/mod" element={<BoardModerator />} />
//                     <Route path="/admin" element={<BoardAdmin />} />
//                 </Routes>
//             </div>
//         </div>
//     );
// };


export default App;
