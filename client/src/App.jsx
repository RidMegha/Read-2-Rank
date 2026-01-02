import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TodaysGK from './pages/TodaysGK';
import RevisionHub from './pages/RevisionHub';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Archive from './pages/Archive';
import NewsReader from './pages/NewsReader';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


function App() {
  return (
    <ThemeProvider>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Homepage />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="about" element={<About />} />
                        <Route path="archive" element={<Archive />} />
                        <Route path="news/read" element={<NewsReader />} />
                        
                        {/* Protected Routes */}
                        <Route path="gk/today" element={
                            <ProtectedRoute>
                                <TodaysGK />
                            </ProtectedRoute>
                        } />
                        <Route path="revision" element={
                            <ProtectedRoute>
                                <RevisionHub />
                            </ProtectedRoute>
                        } />
                         <Route path="profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="settings" element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        } />
                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
