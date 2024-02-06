import React, { useState, useEffect, useRef } from "react";
import axios, { all } from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { BASE_URL, isPhone } from "../App";
import toastr from "toastr";
import $ from "jquery";
import "bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const Employee = () => {
  const [departments, setdepartments] = useState([]);
  const [branches, setbranches] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [show_emp, setShow_emp] = useState(false);
  const [show_edit, setShow_edit] = useState(false);
  const [show_del, setShow_del] = useState(false);

  const handleShow_emp = () => setShow_emp(true);
  const handleClose_emp = () => setShow_emp(false);

  const handleShow_edit = () => setShow_edit(true);
  const handleClose_edit = () => setShow_edit(false);

  const handleShow_del = () => setShow_del(true);
  const handleClose_del = () => setShow_del(false);

  const getdepartments = () => {
    axios
      .get(BASE_URL + "getalldepts")
      .then((response) => {
        let departments = response.data;
        setdepartments(departments);
        console.log("departments", departments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getbranch = (id) => {
    if (id !== "") {
      axios
        .get(BASE_URL + "getallbranch", {
          params: {
            depart_id: id,
          },
        })
        .then((response) => {
          let branches = response.data;
          setbranches(branches);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetchData();
    getdepartments();
    document.title = "AMS-Users";
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "allusers");
      if (response.data.status !== "fail") {
        setData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let i = 0;
  const columns = [
    {
      name: "SL",
      selector: "sl",
      cell: (row, index) => index + 1,
      sortable: true,
    },
    { name: "Name", selector: "name", sortable: true },
    { name: "Username", selector: "username", sortable: true },
    { name: "Department", selector: "depart_id", sortable: true },
    { name: "Branch", selector: "branch_id", sortable: true },
    { name: "Role", selector: "role_id", sortable: true },
    {
      name: "Action",
      selector: "sl",
      cell: (row) => (
        <div>
          <i
            className="fa fa-edit text-primary pointer"
            onClick={() => {
              edit(row.id);
            }}
          />{" "}
          <i
            className="fa fa-trash text-danger pointer"
            onClick={() => dele(row.id)}
          />
        </div>
      ),
      width: "8rem",
      sortable: false,
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    depart_id: "",
    branch_id: "",
    username: "",
    password: "",
    email: "",
    mobile: "",
    role_id: "",
  });
  const [eformData, seteFormData] = useState({
    id: "",
    name: "",
    depart_id: "",
    branch_id: "",
    username: "",
    password: "",
    email: "",
    mobile: "",
    role_id: "",
  });
  const [dformData, setdFormData] = useState({ id: "" });

  const handlChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlsChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    getbranch(e.target.value);
  };

  const handleditChange = (e) => {
    seteFormData({ ...eformData, [e.target.name]: e.target.value });
    getbranch(e.target.value);
  };

  const handleChange = (e) => {
    seteFormData({ ...eformData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(BASE_URL + "allusers", formData)
      .then((response) => {})
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const handlesaveSubmit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + "saveuser", formData)
      .then((response) => {
        toastr.success(response.data + " Has Created..");
        fetchData();
        handleClose_emp();
      })
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + `user_ego`, eformData)
      .then((response) => {
        toastr.success(response.data + " Has Updated..");
        seteFormData({
          name: "",
          depart_id: "",
          branch_id: "",
          username: "",
          password: "",
          email: "",
          mobile: "",
          role_id: "",
        });
        fetchData();
        handleShow_edit();
      })
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const handleDelete = (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(BASE_URL + "user_dgo", { data: { id: id } })
          .then((response) => {
            fetchData();
            Swal.fire("Deleted!", "Your data has been deleted.", "success");
          })
          .catch((error) => {
            toastr.error("Connection Error..");
          });
      }
    });
  };

  const edit = (num) => {
    axios
      .get(BASE_URL + "getuser", {
        params: {
          id: num,
        },
      })
      .then((response) => {
        let data = response.data.filter((obj) => obj.id === num);
        getbranch(data[0].depart_id);
        console.log("data is", data);
        seteFormData({
          id: num,
          name: data[0].name,
          depart_id: data[0].depart_id,
          branch_id: data[0].branch_id,
          email: data[0].email,
          mobile: data[0].mobile,
          role_id: data[0].role_id,
        });

        handleShow_edit();
      })
      .catch((error) => {
        toastr.error("Connection Error..");
      });
  };

  const dele = (id) => {
    handleDelete(id);
  };

  const tableData = {
    columns,
    data,
  };

  return (
    <div className="card card-solid card-primary card-outline">
      <div className="card-header">
        <h3 className="card-title">
          <i className="fas fa-users"></i> Users
        </h3>

        <div className="card-tools">
          <button
            type="button"
            id="addemp"
            className="btn btn-sm btn-success"
            onClick={handleShow_emp}
          >
            <i className="fas fa-plus"></i> New
          </button>

          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>

      <div className="card-body pb-0">
        <div className="row">
          <DataTableExtensions {...tableData}>
            <DataTable defaultSortField="sl" pagination highlightOnHover />
          </DataTableExtensions>
        </div>
      </div>

      {/* Modals */}
      <Modal show={show_emp} onHide={handleClose_emp}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New User</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose_emp}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form action="" id="" onSubmit={handlesaveSubmit}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="form-group">
                  <div className="input-group mt-2">
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Name
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.name}
                      onChange={handlChange}
                      name="name"
                      placeholder="Name"
                      type="text"
                    />
                  </div>

                  <div className="input-group mt-2">
                    <lable
                      className="col-sm-4 col-form-lable"
                      htmlFor="req_relieve_date"
                    >
                      Department
                    </lable>
                    <select
                      className="form-control form-control-sm"
                      name="depart_id"
                      id="depart_id"
                      onChange={handlsChange}
                      value={formData.depart_id}
                    >
                      <option value="" selected="selected" disabled="disabled">
                        Select Department
                      </option>
                      {departments.map((dept) => {
                        return (
                          <option value={dept.id}>
                            {dept.department_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="input-group mt-2">
                    <lable
                      className="col-sm-4 col-form-lable"
                      htmlFor="req_relieve_date"
                    >
                      Branch
                    </lable>
                    <select
                      className="form-control form-control-sm"
                      name="branch_id"
                      id="branch_id"
                      onChange={handlChange}
                      value={formData.branch_id}
                    >
                      <option value="" selected="selected">
                        Select Branch
                      </option>
                      {branches.status !== "fail"
                        ? branches?.map((branch) => {
                            return (
                              <option value={branch.id}>
                                {branch.branch_name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div className="input-group mt-2">
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Username
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.username}
                      onChange={handlChange}
                      name="username"
                      placeholder="Username"
                      type="text"
                    />
                  </div>

                  <div className="input-group mt-2">
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Password
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.password}
                      onChange={handlChange}
                      name="password"
                      placeholder="Password"
                      type="password"
                    />
                  </div>

                  <div className="input-group mt-2">
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      E-mail
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.email}
                      onChange={handlChange}
                      name="email"
                      placeholder="E-mail"
                      type="email"
                    />
                  </div>

                  <div className="input-group mt-2">
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Mobile
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.mobile}
                      onChange={handlChange}
                      onKeyUp={isPhone}
                      name="mobile"
                      placeholder="Mobile Number"
                      type="tel"
                    />
                  </div>

                  <div className="input-group mt-2">
                    <lable
                      className="col-sm-4 col-form-lable"
                      htmlFor="req_relieve_date"
                    >
                      Role
                    </lable>
                    <select
                      className="form-control form-control-sm"
                      name="role_id"
                      id="role_id"
                      onChange={handlChange}
                      value={formData.role_id}
                    >
                      <option value="" selected="selected" disabled="disabled">
                        Select Role
                      </option>
                      <option value="0">User</option>
                      <option value="1">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
                onClick={handleClose_emp}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal show={show_edit} onHide={handleClose_edit}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Branch</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true" onClick={handleClose_edit}>
                ×
              </span>
            </button>
          </div>
          <form action="" id="" onSubmit={handleEdit}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="input-group mt-2">
                  <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                    Name
                  </lable>
                  <input
                    className="form-control form-control-sm"
                    value={eformData.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="Name"
                    type="text"
                  />
                </div>

                <div className="input-group mt-2">
                  <lable
                    className="col-sm-4 col-form-lable"
                    htmlFor="req_relieve_date"
                  >
                    Department
                  </lable>
                  <select
                    className="form-control form-control-sm"
                    name="depart_id"
                    onChange={handleditChange}
                    value={eformData.depart_id}
                  >
                    <option value="" selected="selected" disabled="disabled">
                      Select Department
                    </option>
                    {departments.map((dept) => {
                      return (
                        <option value={dept.id}>{dept.department_name}</option>
                      );
                    })}
                  </select>
                </div>

                <div className="input-group mt-2">
                  <lable
                    className="col-sm-4 col-form-lable"
                    htmlFor="req_relieve_date"
                  >
                    Branch
                  </lable>
                  <select
                    className="form-control form-control-sm"
                    name="branch_id"
                    id="branch_id"
                    onChange={handleChange}
                    value={eformData.branch_id}
                  >
                    <option value="" selected="selected" disabled="disabled">
                      Select Branch
                    </option>
                    {branches.status !== "fail"
                      ? branches?.map((branch) => {
                          return (
                            <option value={branch.id}>
                              {branch.branch_name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>

                <div className="input-group mt-2">
                  <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                    E-mail
                  </lable>
                  <input
                    className="form-control form-control-sm"
                    value={eformData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="E-mail"
                    type="email"
                  />
                </div>

                <div className="input-group mt-2">
                  <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                    Mobile
                  </lable>
                  <input
                    className="form-control form-control-sm"
                    value={eformData.mobile}
                    onChange={handleChange}
                    onKeyUp={isPhone}
                    name="mobile"
                    placeholder="Mobile Number"
                    type="tel"
                  />
                </div>

                <div className="input-group mt-2">
                  <lable
                    className="col-sm-4 col-form-lable"
                    htmlFor="req_relieve_date"
                  >
                    Role
                  </lable>
                  <select
                    className="form-control form-control-sm"
                    name="role_id"
                    id="role_id"
                    onChange={handleChange}
                    value={eformData.role_id}
                  >
                    <option value="" selected="selected" disabled="disabled">
                      Select Role
                    </option>
                    <option value="0">User</option>
                    <option value="1">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
                onClick={handleClose_edit}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* <Modal show={show_del} onHide={handleClose_del}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Branch</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true" onClick={handleClose_del}>
                ×
              </span>
            </button>
          </div>
          <form action="" id="" onSubmit={handleDelete}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="form-row">
                  Do You Want to delete ?
                  <input
                    className="form-control form-control-sm"
                    value={dformData.id}
                    name="id"
                    type="hidden"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
                onClick={handleClose_del}
              >
                No
              </button>
              <button type="submit" className="btn btn-danger btn-sm">
                Yes
              </button>
            </div>
          </form>
        </div>
      </Modal> */}
    </div>
  );
};

export default Employee;
