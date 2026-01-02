import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-5 animate-fade-in">

                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
