import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
    const [navmenu, setNavmenu] = useState(false)
    let iconStyles = { color: "white" };
    const handleClick = () => setNavmenu(!navmenu)
    return (
        
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <Link to='/' className="navbar-logo">
                        <img src={process.env.PUBLIC_URL + '/images/pokemon.png'} alt="pokemon" id="mainIcon" />
                        POKEMON
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        {navmenu ? <FaTimes style={iconStyles} /> : <FaBars style={iconStyles} />}
                    </div>
                </div>
                <ul className={navmenu ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' onClick={e=>setNavmenu(!navmenu)} className="nav-links">
                            My Pokemon
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/pokemon' onClick={e=>setNavmenu(!navmenu)} className="nav-links">
                            Pokemon List
                        </Link>
                    </li>
                </ul>  
            </div>
        </>
    )
}

export default Navbar
