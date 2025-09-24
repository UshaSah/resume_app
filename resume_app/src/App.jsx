import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import './styles/Page.css';
import Dashboard from './components/Dashboard';
import ResumeForm from './components/ResumeForm';
// import ResumeDetails from './components/ResumeDetails';
// import VersionHistory from './components/VersionHistory';
// import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        {/* <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} /> */}

        {/* Protected routes */}
        <Route path="/" element={ <ResumeForm /> } />
        <Route path="/register" element={ <Register />} />
        {/* <Route path="/form" element={user ? <ResumeForm user={user} /> : <Navigate to="/login" />} />
        <Route path="/form/:id" element={user ? <ResumeForm user={user} /> : <Navigate to="/login" />} />
        <Route path="/resume/:id" element={user ? <ResumeDetails user={user} /> : <Navigate to="/login" />} />
        <Route path="/versions/:id" element={user ? <VersionHistory user={user} /> : <Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}
export default App;
