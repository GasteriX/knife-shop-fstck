import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from "./components/App/App.tsx";

import MainPage from './components/pages/MainPage/MainPage.tsx';
import KnifesPage from './components/pages/KnivesPage/KnivesPage.tsx';
import KnifeByArticlePage from './components/pages/KnifeByArticlePage/KnifeByArticlePage.tsx';
import LoginPage from './components/pages/LoginPage/LoginPage.tsx';
import RegisterPage from './components/pages/RegisterPage/RegisterPage.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<MainPage></MainPage>} />
          <Route path="/Knife/:id" element={<KnifeByArticlePage></KnifeByArticlePage>} />
          <Route path="/Edit" element={<KnifesPage></KnifesPage>} />
          <Route path="/Login" element={<LoginPage></LoginPage>} />
          <Route path="/Register" element={<RegisterPage></RegisterPage>} />
        </Routes>
      </App>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
