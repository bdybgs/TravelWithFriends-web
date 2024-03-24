import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Map from "./pages/Map";
import Home from "./pages/Home"
import Contacts from "./pages/Contacts"
import Header from "./components/Header";

import { Routes, Route, Link } from "react-router-dom"

// TODO: Нужно изучить:
// React Router, React hooks, Axios, js-cookie

function App() {
  return (
<>
<Header/>
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/contacts" element={<Contacts />}/>

      </Routes>
</>
  );
}

export default App;
