import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import {AuthProvider} from "./hoc/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface Store {
    // Здесь могут быть свойства, специфичные для вашего хранилища аутентификации
    tokenObject: any;
}

const store: Store = {
    // Здесь можете указать свойства вашего хранилища
    tokenObject: null,
};

root.render(
  <React.StrictMode>
      <AuthProvider>
      <BrowserRouter>
    <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
