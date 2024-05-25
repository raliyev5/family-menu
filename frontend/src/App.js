import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/" element={<MainApp />} />
            </Routes>
        </Router>
    );
}

export default App;

function MainApp() {
    return <div>Main Application</div>;
}
