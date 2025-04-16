import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaPen, FaSearch, FaShoppingCart } from 'react-icons/fa';
import './navbar.css';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/navbar.php', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
          setCartCount(data.cartCount || 0);
        }
      })
      .catch(err => console.error('Navbar fetch failed:', err));
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUser(null);     
        setCartCount(0);    
        window.location.href = '/login'; 
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {user ? <Link to="/login">Logout</Link> : <Link to="/login">Login</Link>}
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="menu-icon" onClick={toggleSidebar}>
          <FaBars />
        </div>
        <Link className="navbar-brand" to="/dashboard">LUXE HAVEN</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                <FaSearch />
                {user && <span className="user-id-display">User ID: {user.user_id}</span>}
              </Link>
            </li>

            {user?.user_type === 'admin' && (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  onClick={toggleAdminDropdown}
                >
                  <FaPen />
                </span>
                {adminDropdownOpen && (
                  <div className="dropdown-menu show">
                    <Link className="dropdown-item" to="/insert">Insert</Link>
                    <Link className="dropdown-item" to="/delete">Delete</Link>
                    <Link className="dropdown-item" to="/select">Select</Link>
                    <Link className="dropdown-item" to="/update">Update</Link>
                  </div>
                )}
              </li>
            )}

            {user && (
              <li className="nav-item">
                <Link className="nav-link cart-drop-zone" to="/cart">
                  <FaShoppingCart />
                  <span className="cart-tooltip"></span>
                  {cartCount > 0 && <span className="cart-indicator">{cartCount}</span>}
                </Link>
              </li>
            )}
            
            <li className="nav-item">
            {user ? (
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                Logout
                </span>
            ) : (
                <Link className="nav-link" to="/login">Login</Link>
            )}
            </li>


          </ul>
        </div>
      </nav>
    </>
  );
}
