import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../App";
import toastr from "toastr";
import $ from "jquery";

const Login = () => {
  const [changed_inputs, setchanged_inputs] = useState({
    username: "",
    password: "",
  });

  const changeme = (e) => {
    setchanged_inputs({ ...changed_inputs, [e.target.name]: e.target.value });
  };
  const handeleSubmit = (element) => {
    element.preventDefault();

    let data = {
      username: changed_inputs.username,
      password: changed_inputs.password,
    };

    axios
      .post(BASE_URL + "login", data)
      .then((response) => {
        var data = response.data.data;
        console.log(data);
        if (data.uid >= 0) {
          window.sessionStorage.setItem("username", data.username);
          window.sessionStorage.setItem("email", data.email);
          window.sessionStorage.setItem("uid", data.uid);
          window.sessionStorage.setItem("name", data.name);
          window.sessionStorage.setItem("mobile", data.mobile);
          window.sessionStorage.setItem("pphoto", data.pphoto);
          window.sessionStorage.setItem("role_id", data.role_id);
          window.sessionStorage.setItem("depart_id", data.depart_id);
          window.sessionStorage.setItem("branch_id", data.branch_id);
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <body className="hold-transition login-page">
      <div className="login-box bg-secondary">
        <div className="card bg-secondary">
          <div className="login-logo">
            <b>ACETECH</b> IT
          </div>
          <div className="card-body login-card-body bg-secondary">
            <p className="login-box-msg">Sign in to start your session</p>

            <form action="" onSubmit={handeleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  name="username"
                  onChange={changeme}
                  className="form-control"
                  placeholder="Username"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user text-light" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  name="password"
                  onChange={changeme}
                  className="form-control"
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock text-light" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-sm btn-info btn-block"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </body>
  );
};
export default Login;
