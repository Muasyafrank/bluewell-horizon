import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** Public site shell: fixed navbar, routed page, footer. */
export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <a className="bw-skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
