import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import toastr from "toastr";
import $ from "jquery";
import { BASE_URL } from "../App";
import "bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const Branch = () => {
  const [departments, setdepartments] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [show_branch, setShow_branch] = useState(false);

  const [show_edit, setShow_edit] = useState(false);

  const handleShow_branch = () => setShow_branch(true);
  const handleClose_branch = () => setShow_branch(false);

  const handleShow_edit = () => setShow_edit(true);
  const handleClose_edit = () => setShow_edit(false);

  const getdepartments = () => {
    axios
      .get(BASE_URL + "getalldepts")
      .then((response) => {
        let departments = response.data;
        setdepartments(departments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
    getdepartments();
    document.title = "AMS-Branch";
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "branches");
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
      width: "8rem",
    },
    ,
    {
      name: "Department name",
      selector: "depart_name",
      sortable: true,
      width: "10rem",
    },
    {
      name: "Branch name",
      selector: "branch_name",
      sortable: true,
    },
    {
      name: "Action",
      selector: "sl",
      cell: (row) => (
        <div>
          <i
            className="fa fa-edit text-primary pointer"
            onClick={() => edit(row.id)}
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

  const [formData, setFormData] = useState({ branch_name: "", depart_id: "" });
  const [eformData, seteFormData] = useState({
    branch_name: "",
    id: "",
    depart_id: "",
  });
  const [dformData, setdFormData] = useState({ id: "" });

  const handlChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    seteFormData({ ...eformData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + "branch_go", formData)
      .then((response) => {
        toastr.success(response.data + " Has Created..");
        setFormData({ branch_name: "", depart_id: "" });
        fetchData();
        handleClose_branch();
      })
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    console.log("eformdata is", eformData);
    axios
      .post(BASE_URL + "branch_ego", eformData)
      .then((response) => {
        toastr.success(response.data + " Has Updated..");
        seteFormData({ branch_name: "", depart_id: "", id: "" });
        fetchData();
        handleClose_edit();
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
          .delete(BASE_URL + "branch_dgo", { data: { id: id } })
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

  // const addemp = () => {
  //   $("#addcat").modal("show");
  // };

  const edit = (id) => {
    axios
      .get(BASE_URL + "getbranch", {
        params: {
          id: id,
        },
      })
      .then((response) => {
        let data = response.data.filter((obj) => obj.id === id);
        seteFormData({
          branch_name: data[0].branch_name,
          id: data[0].id,
          depart_id: data[0].depart_id,
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
          <i className="fas fa-code-branch"></i> Branch
        </h3>

        <div className="card-tools">
          <button
            type="button"
            id="addemp"
            className="btn btn-sm btn-success"
            onClick={handleShow_branch}
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
      <Modal show={show_branch} onHide={handleClose_branch}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Branch</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose_branch}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form action="" id="" onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="form-group">
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
                      onChange={handlChange}
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
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Branch Name
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={formData.branch_name}
                      onChange={handlChange}
                      name="branch_name"
                      placeholder="Enter Name"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
                onClick={handleClose_branch}
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
              onClick={handleClose_edit}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form action="" id="" onSubmit={handleEdit}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="form-group">
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
                      id="edepart_id"
                      onChange={handleChange}
                      value={eformData.depart_id}
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
                    <lable className="col-sm-4 col-form-lable" htmlFor="reason">
                      Branch Name
                    </lable>
                    <input
                      className="form-control form-control-sm"
                      value={eformData.branch_name}
                      onChange={handleChange}
                      name="branch_name"
                      placeholder="Enter Name"
                      type="text"
                    />
                  </div>
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

      <div
        className="modal fade bd-example-modal-sm"
        id="delemodal"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Branch</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
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
                >
                  No
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Yes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branch;
