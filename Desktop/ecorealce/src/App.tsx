import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MediaArea from './pages/MediaArea';
import QuickLinks from './pages/QuickLinks';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

function App() {
  // Simple auth mock for now
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="media" element={<MediaArea />} />
          <Route path="links" element={<QuickLinks />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
