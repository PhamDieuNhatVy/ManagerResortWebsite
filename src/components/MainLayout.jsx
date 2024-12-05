import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className=" bg-white">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
