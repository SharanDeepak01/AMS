import { Component } from "react";
import React from "react";

class Nav extends Component {
  render() {
    const handleLogout = () => {
      sessionStorage.clear();
      window.location.href = "/";
    };
    return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell" />
              <span className="badge badge-danger navbar-badge" id="noticnt" />
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <div className="dropdown-divider" />
              <a href="/" className="dropdown-item dropdown-footer">
                See All notifications
              </a>
              <div className="dropdown-divider" />
              <div id="notificdatas"></div>
            </div>
          </li>

          <li className="nav-item dropdown user user-menu m-2">
            <a data-toggle="dropdown" href="#">
              <img
                src=""
                className="user-image rounded-circle"
                alt="User Image"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
              <li className="user-header">
                <img
                  src=""
                  className="float-left rounded-circle"
                  alt="User Image"
                />
                <p>{window.sessionStorage.getItem("name")}</p>
                <small className="mb-5">
                  {window.sessionStorage.getItem("email")}
                </small>
                <a href="#" className="btn btn-secondary btn-sm">
                  My Profile
                </a>
              </li>
              <li className="user-footer">
                <div className="pull-right">
                  <a
                    onClick={handleLogout}
                    className="btn btn-block btn-danger"
                  >
                    <i className="ion ion-power" /> Log Out
                  </a>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
