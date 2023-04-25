/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";

import "./LeftMenuBar.css";
import RequestController from '../../controllers/RequestController';
import PropTypes from 'prop-types';

const LeftMenuBar = (props) => {
    const [currentPathname, setCurrentPathname] = useState(window.location.pathname);
    const [pageMenu, setPageMenu] = useState({Pages: []});

    useEffect(() => {
        initPageMenu();
    }, []);

    const initPageMenu = () => {
        RequestController.getPages({})
        .then(response => response.json())
        .then((data) => {
            const result = data["result"];
            if(result["status"] === "success"){
                let pageList = []
                Object.keys(result["body"]).forEach((id) => {
                    pageList.push({
                        link: `/${result["body"][id]["name"]}`, 
                        subject: `${result["body"][id]["display_name"]}`
                    });
                });
                setPageMenu({...pageMenu, Pages: pageList});
                console.log(pageMenu);
            }
        });
    };

    return (
        <>
            <div class="left-menu-bar">
                {pageMenu[props.activeTabProp.activeTab].map((subMenu) => {
                    const calLegacyUrl = props.legacyUrl === "/" ? "" : props.legacyUrl;

                    const getMenuClassname = () => {
                        return (currentPathname === `${calLegacyUrl}${subMenu.link}`) ? "left-sub-menu active" : "left-sub-menu";
                    };

                    const onClickLink = () => {
                        setCurrentPathname(`${calLegacyUrl}${subMenu.link}`);
                    };

                    return (
                        <Link to={`${calLegacyUrl}${subMenu.link}`} className="no-link-looking" onClick={onClickLink}><li className={`${getMenuClassname()}`}>{subMenu.subject}</li></Link>
                    )
                })}
            </div>
            <div class="right-content-plain">
                <Outlet />
            </div>
        </>
    );
}

LeftMenuBar.propTypes = {
    activeTabProp: PropTypes.object.isRequired, 
}

export default LeftMenuBar;
