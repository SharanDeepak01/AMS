import { useState ,useEffect } from "react";
import {createRoot} from 'react-dom/client';
import { Link } from 'react-router-dom';
import React from "react";
import axios from "axios";
import { BASE_URL } from "../App";


  const Side = () => {
    const [menus, setMenus]           = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [activepid, setActivepid]   = useState(null);
    const [activepidm, setActivepidm] = useState(null);
    var uid = window.sessionStorage.getItem('uid');
    let data = {uid:uid}
    const loadMenu = () => {
      axios.get(BASE_URL +'menu',{params: data })
        .then((response) => {
          let mymenus = response.data.data;
          setMenus(mymenus);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    useEffect(() => {
      loadMenu();
    }, []);

    const handleItemClick = (item,pid) => {
      setActiveItem(item);
      setActivepid(pid);
      setActivepidm(pid);
    };
  
    const isItemActive = (item) => {
      return activeItem === item ? 'active' : '';
    };

    const ismItemActive = (pid) => {
      return activepidm === pid ? 'active' : '';
    };

    const isactivepid = (pid) => {
      return activepid === pid ? 'menu-open' : '';
    };

    var i = 0;

    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <b className="brand-link">
          {/* <img  src="http://ksjkjd.kk/xcdv.png" alt="Logo"   className="brand-image img-circle elevation-3"  style={{ opacity: ".8" }}  /> */}
          <span className="brand-text font-weight-light" style={{ fontFamily: "verdana" }}>
            ACETECH
          </span>
        </b>
  
        <div className="sidebar">
          <div className="form-inline m-1">
            <div className="input-group" data-widget="sidebar-search">
              <input className="form-control form-control-sidebar"  type="search" placeholder="Search" aria-label="Search"  />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" >
              { menus.map((menu) => {
                if (menu.is_main_menu === 0) {
                  if (menu.menu_name === "") {
                    return menus.map((submenu) => {
                      if (menu.menu_id === submenu.parent_id && submenu.is_main_menu === 1 && submenu.menuid == 0) {
                        return (
                          <li key={++i} className="nav-item" onClick={() => handleItemClick(submenu.menu_id,submenu.parent_id)}>
                                 <Link to={submenu.url} className={`nav-link ${isItemActive(submenu.menu_id)}`}>
                                      <i className="nav-icon fas fa-th" />
                                      <p>{submenu.menu_name}</p>
                                    </Link>
                          </li>
                        );
                      } 
                      else if(menu.menu_id === submenu.parent_id && submenu.is_main_menu === 1 && submenu.menuid == 1){
                        return (
                          <li key={++i} className="nav-item">
                            <a href="" className="nav-link">
                              <i className="nav-icon fas fa-tachometer-alt" />
                              <p>
                                {submenu.menu_name}
                                <i className="right fas fa-angle-left" />
                              </p>
                            </a>
                            <ul className="nav nav-treeview">
                              {menus.map((submenusu, idd) => {
                                if (
                                  submenu.menu_id === submenusu.parent_id &&
                                  submenusu.is_main_menu === 2 && submenusu.menuid == 2
                                ) {
                                  return (
                                    <li key={++i} className="nav-item"  onClick={() => handleItemClick(submenusu.menu_id,submenusu.parent_id)}>
                                    <Link to={submenusu.url} className={`nav-link ${isItemActive(submenusu.menu_id)}`}>
                                      <i className="nav-icon fas fa-th" />
                                      <p>{submenusu.menu_name}</p>
                                    </Link>
                                    </li>
                                  );
                                }
                              })}
                            </ul>
                          </li>
                        );
                      }
                    });
                  } else {
                    return (
                      <>
                      <li key={menu.menu_id} className="nav-header">
                        {menu.menu_name}
                      </li> 


                      {menus.map((ssubmenu) => {
                      if (menu.menu_id === ssubmenu.parent_id && ssubmenu.is_main_menu === 1 && ssubmenu.menuid == 0) {
                        return (
                          <li key={++i} className="nav-item" onClick={() => handleItemClick(ssubmenu.menu_id,ssubmenu.parent_id)}>
                           <Link to={ssubmenu.url} className={`nav-link ${isItemActive(ssubmenu.menu_id)}`}>
                          <i className="nav-icon fas fa-th" />
                          <p>{ssubmenu.menu_name}</p>
                        </Link>
                          </li>
                        );
                      } 
                    
                      else if (menu.menu_id === ssubmenu.parent_id && ssubmenu.is_main_menu === 1 && ssubmenu.menuid == 1){
                        return (
                          <li key={++i} className={`nav-item ${isactivepid(ssubmenu.menu_id)}`}>
                           <Link to={ssubmenu.url} className={`nav-link ${ismItemActive(ssubmenu.menu_id)}`}>
                            <i className={`nav-icon fas fa-${ssubmenu.icon}`} />
                            <p>
                              {ssubmenu.menu_name}
                              <i className="right fas fa-angle-left" />
                            </p>
                          </Link>
                            <ul className="nav nav-treeview">
                              {menus.map((ssubmenusu, idd) => {
                                if (ssubmenu.menu_id === ssubmenusu.parent_id && ssubmenusu.is_main_menu === 2 && ssubmenusu.menuid == 2) {
                               
                                  return (
                                    <li key={++i} className="nav-item" onClick={() => handleItemClick(ssubmenusu.menu_id,ssubmenusu.parent_id)}>
                                     <Link to={ssubmenusu.url} className={`nav-link ${isItemActive(ssubmenusu.menu_id)}`}>
                                      <i className="far fa-circle nav-icon" />
                                      <p>{ssubmenusu.menu_name}</p>
                                    </Link>
                                    </li>
                                  );
                                }
                              })}
                            </ul>
                          </li>
                        );
                      }
                    })} </>)







                    
                  }
                }
              })}
            </ul>
          </nav>
        </div>
      </aside>
    )
}

export default Side;

// const root = createRoot(document.getElementById('side'));
// root.render(<Side/>)