import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { BASE_URL } from "../App";
import toastr from "toastr";
import $ from "jquery";
import "bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const Brand = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [show_brand, setShow_brand] = useState(false);
  const [show_edit, setShow_edit] = useState(false);

  const handleShow_brand = () => setShow_brand(true);
  const handleClose_brand = () => setShow_brand(false);

  const handleShow_edit = () => setShow_edit(true);
  const handleClose_edit = () => setShow_edit(false);

  useEffect(() => {
    document.title = "AMS-Brand";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "brands");
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
    {
      name: "Brand name",
      selector: "brand_name",
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

  const [formData, setFormData] = useState({ brand_name: "" });
  const [eformData, seteFormData] = useState({ brand_name: "", id: "" });
  const [dformData, setdFormData] = useState({ id: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditchange = (e) => {
    seteFormData({ ...eformData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + "brand_go", formData)
      .then((response) => {
        toastr.success(response.data + " Has Created..");
        setFormData({ brand_name: "" });
        fetchData();
        handleClose_brand();
      })
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + "brand_ego", eformData)
      .then((response) => {
        toastr.success(response.data + " Has Updated..");
        seteFormData({ brand_name: "", id: "" });
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
          .delete(BASE_URL + "brand_dgo", { data: { id: id } })
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

  // const handleDelete = (e) => {
  //   e.preventDefault();
  //   axios
  //     .post(BASE_URL + "brand_dgo", dformData)
  //     .then((response) => {
  //       toastr.success("Department Has been deleted..");
  //       setdFormData({ id: "" });
  //       fetchData();
  //       $("#delemodal").modal("hide");
  //     })
  //     .catch((error) => {
  //       toastr.error("Connection Error..");
  //     });
  // };

  const edit = (id) => {
    axios
      .get(BASE_URL + "brands", {
        params: {
          id: id,
        },
      })
      .then((response) => {
        let data = response.data.filter((obj) => obj.id === id);
        console.log(data);
        seteFormData({ brand_name: data[0].brand_name, id: data[0].id });
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
          <i className="fas fa-images"></i> Brands
        </h3>

        <div className="card-tools">
          <button
            type="button"
            id="addemp"
            className="btn btn-sm btn-success"
            onClick={handleShow_brand}
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
      <Modal show={show_brand} onHide={handleClose_brand}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Brand</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose_brand}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form action="" id="" onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="form-row">
                  <div className="input-group mt-2">
                    <label
                      className="col-form-lable mr-2"
                      htmlFor="category_name"
                    >
                      Brand
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={formData.brand_name}
                      onChange={handleChange}
                      name="brand_name"
                      placeholder="Brand Name"
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
                onClick={handleClose_brand}
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
            <h5 className="modal-title">Edit Brand</h5>
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
                <div className="form-row">
                  <div className="input-group mt-2">
                    <label className="col-form-lable mr-2" htmlFor="brand_name">
                      Category
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={eformData.brand_name}
                      onChange={handleEditchange}
                      name="brand_name"
                      placeholder="Brand Name"
                      type="text"
                    />
                    <input
                      className="form-control form-control-sm"
                      value={eformData.id}
                      onChange={handleEditchange}
                      name="id"
                      type="hidden"
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
              <h5 className="modal-title">Delete Brand</h5>
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

export default Brand;
