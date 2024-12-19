import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from "./components/App/App.tsx";

import KnifesPage from './components/pages/KnifesPage/KnifesPage.tsx';
import LoginPage from './components/pages/LoginPage/LoginPage.tsx';
import RegisterPage from './components/pages/RegisterPage/RegisterPage.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/Edit" element={<KnifesPage></KnifesPage>} />
          <Route path="/Login" element={<LoginPage></LoginPage>} />
          <Route path="/Register" element={<RegisterPage></RegisterPage>} />
        </Routes>
      </App>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
