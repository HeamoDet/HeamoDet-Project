"use client";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt, faHeartbeat, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; 
import { usePathname } from 'next/navigation';

function Navbar({ authentication }) {
  const pathName = usePathname();
  const isSignupPage = pathName === '/'; 
  const isLoginPage = pathName === '/login';
  const router = useRouter();

  const handleAuthentication = () => {
    if (isLoginPage) {
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  const handleSignOut = ()=>{
    console.log("Signing out");
    localStorage.clear()
    router.push('/login')
}

  return (
    <nav className="navbar navbar-expand-lg overflow-hidden fixed-top" style={{ backgroundColor: '#F95454', padding: '0.3rem 1rem' }}>
      <a className="navbar-brand d-flex align-items-center" href="#">
        <FontAwesomeIcon icon={faHeartbeat} className="text-white me-1" style={{ fontSize: '1em' }} />
        <span className="ml-2" style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1em' }}>Heamodet</span>
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {/* Show Sign Out if authenticated, otherwise show Login/Signup */}
          {authentication ? (
            <li className="nav-item">
              <a 
                className="nav-link d-flex align-items-center" 
                href="#" 
                style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9em' }} 
                onClick={handleSignOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" style={{ fontSize: '0.9em' }} />
                Sign Out
              </a>
            </li>
          ) : (
            <li className="nav-item">
              <a 
                className="nav-link d-flex align-items-center" 
                href="#" 
                style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9em' }} 
                onClick={handleAuthentication}
              >
                <FontAwesomeIcon icon={isLoginPage ? faUserPlus : faSignInAlt} className="me-1" style={{ fontSize: '0.9em' }} />
                {isLoginPage ? 'Signup' : 'Login'}
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
