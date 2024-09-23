import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18에서 createRoot 사용
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './fonts.css'; // Import the new CSS file with the font-face rule
import App from './App';
import Loginpage from './Loginpage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/App/*" element={<App />} /> {/* /App 하위 경로 처리 */}
      </Routes>
    </BrowserRouter>
  
);
