/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import './MyNavBar.css';
// import RhinoImage from "../../img/safecoms-rhino.png"
import { Navbar, Nav, NavLink, Dropdown } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import PropTypes from 'prop-types';

const RhinoImage = "/test_react_website/static/src/img/safecoms-rhino.png";

const MyNavBar = (props) => {
    const mainMenus = ["Pages"];
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setUserName(sessionStorage.getItem("userName"));
    }, [props.userName]);

    const onClickLogout = (event) => {
        window.location.pathname = "/web/session/logout";
    };

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ml-auto"/>
            <NavbarCollapse id="responsive-navbar-nav-left">
                <Nav>
                    {/* {mainMenus.map((menuName) => {
                        const isActive = `${menuName === props.activeTabProp.activeTab ? 'active' : ''}`;

                        const handleClickNavLink = (event) => {
                            props.activeTabProp.setactiveTab(menuName);
                        };

                        return (
                            <NavLink key={menuName} className={isActive} onClick={handleClickNavLink}>{menuName}</NavLink>
                        )
                    })} */}
                    <NavLink key={mainMenus[0]}>
                        <img src={RhinoImage} className="header-logo-image"/>
                    </NavLink>
                </Nav>
            </NavbarCollapse>
            <NavbarCollapse id="responsive-navbar-nav-right" className="justify-content-end">
                <Nav>
                    <NavLink>
                        <Dropdown className="header-user-dropdown">
                            <Dropdown.Toggle size="sm" variant="outline-secondary" id="dropdown-risk-level">
                                {userName}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onClickLogout}>Log out</Dropdown.Item>     
                            </Dropdown.Menu>
                        </Dropdown>
                    </NavLink>
                </Nav>
            </NavbarCollapse>
        </Navbar>
    );
}

MyNavBar.propTypes = {
    activeTabProp: PropTypes.object.isRequired, 
}

export default MyNavBar;
