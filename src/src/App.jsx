import { Component } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Usere from "./pages/user";
import Employee from "./pages/Employee";
import Category from "./pages/Category";
import Upload from "./pages/Upload";
import Sub_upload from "./pages/Sub_upload";
import Foot from "./template/Foot";
import Side from "./template/Side";
import Nav from "./template/Nav";
import Login from "./pages/Login";
import Department from "./pages/Department";
import Assetmaster from "./pages/Assetmaster";
import Branch from "./pages/Branch";
import Brand from "./pages/Brand";

//export const BASE_URL = "http://localhost/APIAMS/api/";

export const BASE_URL = "http://172.16.5.125/APIAMS/api/";

export const today = new Date().toISOString().slice(0, 10);

export const isPhone = (event) => {
  const inputValue = event.target.value.replace(/[^0-9]/g, "");
  if (inputValue.length > 10) {
    event.target.value = inputValue?.slice(0, 10);
  } else {
    event.target.value = inputValue;
  }
};

export const isPin = (event) => {
  const inputValue = event.target.value.replace(/[^0-9]/g, "");
  if (inputValue.length > 6) {
    console.log(inputValue);
    event.target.value = inputValue?.slice(0, 6);
  } else {
    event.target.value = inputValue;
  }
};

export const isNumber = (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
};

class App extends Component {
  render() {
    const uid = window.sessionStorage.getItem("uid");
    return (
      <BrowserRouter>
        {uid !== null ? (
          <>
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
      </BrowserRouter>
    );
  }
}

export default App;

// const root = createRoot(document.getElementById('app'));
// root.render(<App/>)
