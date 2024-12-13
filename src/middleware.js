import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let isAdmin;
  try {
    // console.log(token); 
    isAdmin = jwtDecode(token).isAdmin;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Define paths
  const userPath = '/user/';
  const adminPath = '/admin/';

  const currentPath = request.nextUrl.pathname;

  const isUserRestricted = currentPath.startsWith(userPath);
  const isAdminRestricted = currentPath.startsWith(adminPath);

  // try {
  //    if(token){
  //     if (currentPath === '/login' || currentPath === '/signup') {
  //       return isAdmin ? NextResponse.redirect(new URL('/admin/dashboard', request.url)) : NextResponse.redirect(new URL('/user/dashboard', request.url));
  //     }
  //    }
  // } catch (error) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }


  // Admin trying to access user
  if (isUserRestricted && isAdmin) {
    return NextResponse.redirect(new URL('/not-authorized', request.url));
  }

  // Non-admin trying to access admin
  if (isAdminRestricted && !isAdmin) {
    return NextResponse.redirect(new URL('/not-authorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/admin','/admin/:path*'],
};