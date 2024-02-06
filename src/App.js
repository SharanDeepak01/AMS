import { Component } from "react";
import {createRoot} from 'react-dom/client';
import React from "react";
import { HashRouter,Routes, Route, Navigate} from "react-router-dom";
// import Usere from "./src/pages/user";
import Employee from "./src/pages/Employee";
import Category from "./src/pages/Category";
import Upload from "./src/pages/Upload";
import Sub_upload from "./src/pages/Sub_upload";
import Foot from "./src/template/Foot";
import Side from "./src/template/Side";
import Nav from "./src/template/Nav";
import Login from "./src/pages/Login";
import Department from "./src/pages/Department";
import Assetmaster from "./src/pages/Assetmaster";
import Branch from "./src/pages/Branch";
import Brand from "./src/pages/Brand";

export const BASE_URL = 'http://localhost:3000/';

export const today = new Date().toISOString().slice(0, 10);

export const isPhone = (event) => { const inputValue = event.target.value.replace(/[^0-9]/g, '');
                                    if (inputValue.length > 10) {
                                      event.target.value = inputValue.slice(0, 10);
                                    } else {
                                      event.target.value = inputValue;
                                    } }

export const isPin = (event) => { const inputValue = event.target.value.replace(/[^0-9]/g, '');
                                    if (inputValue.length > 6) {
                                      event.target.value = inputValue.slice(0, 6);
                                    } else {
                                      event.target.value = inputValue;
                                    } }

export const isNumber = (event) => { event.target.value = event.target.value.replace(/[^0-9]/g, ''); }


class App extends Component{
  render() {
      const uid = window.sessionStorage.getItem('uid');
     return (
    <HashRouter>
      {uid !== null ? ( <>
      <Nav />
      <Side />
      <div className="content-wrapper">
      <br />
      <section className="content">
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<h1>AMS</h1>} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/Brand" element={<Brand />} />
          <Route path="/category" element={<Category />} />
          <Route path="/department" element={<Department />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/assetmaster" element={<Assetmaster />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/Sub_upload" element={<Sub_upload />} />
          <Route path="*" element={<h1>AMS</h1>} />
        </Routes>
      </div>
      </section>
      </div>
    <Foot />
    </>
    ) : (
     
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Login />} />
        </Routes>
  )}
    </HashRouter>
  );
  }
}


const root = createRoot(document.getElementById('app'));
root.render(<App/>)
