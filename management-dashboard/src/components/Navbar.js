import { Outlet, NavLink } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
    return (
        <>
                <nav className="topnav">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/coupons">Coupons</NavLink>
                            <NavLink to="floorplan">Floor Plan</NavLink>
                            <NavLink to="login">Login</NavLink>
                            <NavLink to="register">Register</NavLink>
                </nav>
            <Outlet/>
        </>
    );
}

