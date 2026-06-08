import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ScrollToTop from './ScrollToTop';

const Layout = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;