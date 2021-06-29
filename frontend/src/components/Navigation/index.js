import React from 'react';
import {NavLink} from 'react-router-dom';
import {authenticatUser} from "../../context/auth-context"
import "./style.css"
const Naviagation = ({isAuth}) =>(
    <header className="main-navigation">
        <div className="main-navigation_logo">
            <h1>
                Easy Event
            </h1>
        </div>
        <nav className="main-navigation_item">
            <ul>
                {!isAuth && <li>
                    <NavLink to={"/auth"}>Authentication</NavLink>
                </li>}
                <li>
                    <NavLink to={"/events"}>Events</NavLink>
                </li>
                {isAuth && <li>
                    <NavLink to={"/bookings"}>Bookings</NavLink>
                </li>}
            </ul>
        </nav>
    </header>
);
export default authenticatUser(Naviagation);