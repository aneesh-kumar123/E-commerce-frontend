'use client';

import { useEffect, useState } from 'react'; 
import { usePathname, useRouter } from 'next/navigation'; 
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import './globals.css'; 
import { Toaster } from 'react-hot-toast'; 

export default function Layout({ children }) {
  // const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname(); 
  const router = useRouter(); // To handle redirection
  
  

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to Sports</title>  
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Hide Navbar and Footer for Admin routes */}
        {!isAdminRoute  && <Navbar />}
        
        {/* Show the toaster notification */}
        <Toaster />
        
        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Hide Footer for Admin routes */}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
