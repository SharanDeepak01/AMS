import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { CSVLink } from "react-csv";
import axios from "axios";
import { BASE_URL, today } from "../App";
import toastr from "toastr";
import $ from "jquery";
import "bootstrap";
import Modal from "react-bootstrap/Modal";

const Assetmaster = () => {
  // const addnew = () => {
  //   $("#addasset").modal("show");
  // };

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [accformData, setaccFormData] = useState({
    accasset_name: "",
    accsl_number: "",
    assetacc_type: "",
    acc_brand: "",
    acc_model: "",
    accwarranty_from: "",
    accwarranty_to: "",
    accqr_1: "",
  });
  const [formData, setFormData] = useState({
    asset_name: "",
    category_id: "",
    serial_number: "",
    mac_address: "",
    part_no: "",
    description: "",
    asset_type: "",
    brand_id: "",
    model_no: "",
    purchase_date: "",
    warranty_from: "",
    warranty_to: "",
    qr_1: "",
    qr_2: "",
    other: "",
  });
  const [accsl_numberck, setaccsl_number] = useState([]);

  const [show_asset, setShow_asset] = useState(false);

  const handleShow_asset = () => setShow_asset(true);
  const handleClose_asset = () => setShow_asset(false);

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    axios
      .post(BASE_URL + "add_asset", formData)
      .then((response) => {
        toastr.success(response.data + " Has Created..");
        setFormData({
          asset_name: "",
          category_id: "",
          serial_number: "",
          mac_address: "",
          part_no: "",
          description: "",
          asset_type: "",
          brand_id: "",
          model_no: "",
          purchase_date: "",
          warranty_from: "",
          warranty_to: "",
          qr_1: "",
          qr_2: "",
          other: "",
        });
        fetchData();
        handleClose_asset();
      })
      .catch((error) => {
        toastr.error("Duplicate Entry or Connection Error..");
      });
  };

  const acchandlChange = (e) => {
    setaccFormData({ ...accformData, [e.target.name]: e.target.value });
  };

  const handlChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const accsl_number1 = [];

  const handleadd = (e) => {
    e.preventDefault();
    let isdd = accsl_numberck.includes(accformData.accsl_number);
    let mysl = accformData.accsl_number;
    if (isdd) {
      toastr.error("Duplicate Entry..!");
    } else {
      setaccsl_number([...accsl_numberck, mysl]);
      const tbody = document.getElementById("addacc");
      const row = document.createElement("tr");
      row.innerHTML = `
      <td><input type="hidden" name="accassetm_name[]" value="${accformData.accasset_name}"/>${accformData.accasset_name}</td>
      <td><input type="hidden" name="accslm_number[]" value="${accformData.accsl_number}"/>${accformData.accsl_number}</td>
      <td><input type="hidden" name="assetaccm_type[]" value="${accformData.assetacc_type}"/>${accformData.assetacc_type}</td>
      <td><input type="hidden" name="accm_brand[]" value="${accformData.acc_brand}"/>${accformData.acc_brand}</td>
      <td><input type="hidden" name="accm_model[]" value="${accformData.acc_model}"/>${accformData.acc_model}</td>
      <td><input type="hidden" name="accmwarranty_from[]" value="${accformData.accwarranty_from}"/>${accformData.accwarranty_from}</td>
      <td><input type="hidden" name="accmwarranty_to[]" value="${accformData.accwarranty_to}"/>${accformData.accwarranty_to}</td>
      <td><input type="hidden" name="accqrm_1[]" value="${accformData.accqr_1}"/>${accformData.accqr_1}</td>
      <td><button class="btn btn-sm btn-success delete-btn"><i class="fas fa-minus"></i></button></td>
    `;

      tbody.appendChild(row);

      const deleteButton = row.querySelector(".delete-btn");
      deleteButton.addEventListener("click", (e) =>
        handledel(e, accformData.accsl_number)
      );
    }
  };

  const handledel = (e, myslToRemove) => {
    e.preventDefault();
    setaccsl_number((prevAccsl) =>
      prevAccsl.filter((value) => value !== myslToRemove)
    );
    const rowToRemove = e.target.closest("tr");
    if (rowToRemove) {
      rowToRemove.remove();
    }
  };

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const fetchDataFromServer = async () => {
    try {
      const response = await axios.get(BASE_URL + "categories");
      const optionsData = response.data.map((item) => ({
        value: item.id,
        label: item.category_name,
      }));
      setOptions(optionsData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // const handleSearch = async (query) => {
  //   setSearchQuery(query);
  //   try {
  //     const response = await axios.get(BASE_URL + 'get_cata?query=' + query);
  //     const searchResults = response.data.map((item) => ({
  //       value: item.id,
  //       label: item.category_name,
  //     }));
  //     setOptions(searchResults);
  //   } catch (error) {
  //     console.log("Error searching data:", error);
  //   }
  // };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData({ ...formData, ["category_id"]: selectedOption.value });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "assets");
      if (response.data.status !== "fail") {
        setData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData();
    fetchDataFromServer();
    document.title = "AMS-Asset Master";
  }, []);

  const columns = [
    { name: "ID", selector: "id", sortable: true },
    { name: "Name", selector: "name", sortable: true },
    { name: "Email", selector: "email", sortable: true },
  ];

  return (
    <div className="card card-solid card-primary card-outline">
      <div className="card-header">
        <h3 className="card-title">
          <i className="fas fa-layer-group"> </i> Asset Master
        </h3>

        <div className="card-tools">
          <button
            type="button"
            id="addnew"
            className="btn btn-sm btn-success"
            onClick={handleShow_asset}
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
          <div className="col-md-4">
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-sm"
              />
              <div className="input-group-append">
                <button className="btn btn-success btn-sm" type="button">
                  <i className="fas fa-search" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <CSVLink data={filteredData} filename="data.csv">
              <button className="btn btn-success btn-sm">
                <i className="fas fa-table" /> Export to CSV
              </button>
            </CSVLink>
          </div>
        </div>
        <DataTable columns={columns} data={filteredData} pagination />
      </div>

      {/* <div className="card-body pb-0">
        <div className="row">
          <div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form control-sm col-md-2 "
            />
            <CSVLink data={filteredData} filename="data.csv">
              <button className="btn-sm btn btn-success">
                <i className="fas fa-table" />
              </button>
            </CSVLink>
            <DataTable columns={columns} data={filteredData} pagination />
          </div>
        </div>
      </div> */}

      <Modal show={show_asset} onHide={handleClose_asset} size="xl">
        {/* <div
          className="modal fade"
          id="addasset"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        > */}
        {/* <div className="modal-dialog modal-xl " role="document"> */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalCenterTitle">
              New Asset
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose_asset}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form action="" method="" onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="reason">Asset Name</label>
                    <input
                      className="form-control form-control-sm"
                      name="asset_name"
                      placeholder="Asset Name"
                      onChange={handlChange}
                      value={formData.asset_name}
                      type="text"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="req_relieve_date">Category</label>
                    <Select
                      className="form-control-sm"
                      name="category_id"
                      id="category_id"
                      options={options}
                      value={selectedOption}
                      // value={formData.category_id}
                      onChange={handleSelectChange}
                      // onInputChange={handleSearch}
                      isClearable
                      isSearchable
                      placeholder="Select an option..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Serial Number</label>
                    <input
                      className="form-control form-control-sm"
                      name="serial_number"
                      placeholder="Serial Number"
                      type="text"
                      value={formData.serial_number}
                      onChange={handlChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">MAC Address</label>
                    <input
                      className="form-control form-control-sm"
                      name="mac_address"
                      value={formData.mac_address}
                      placeholder="MAC Address"
                      type="text"
                      onChange={handlChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Part No</label>
                    <input
                      className="form-control form-control-sm"
                      name="part_no"
                      placeholder="Part No"
                      type="text"
                      value={formData.part_no}
                      onChange={handlChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      placeholder="Description"
                      name="description"
                      cols="3"
                      rows="2"
                      onChange={handlChange}
                      value={formData.description}
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="req_relieve_date">Type</label>
                    <select
                      className="form-control form-control-sm"
                      name="asset_type"
                      id="asset_type"
                      onChange={handlChange}
                      value={formData.asset_type}
                    >
                      <option value="" selected="selected" disabled>
                        Select Type
                      </option>
                      <option value="Software">Software</option>
                      <option value="Hardware">Hardware</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Brand</label>
                    <select
                      className="form-control form-control-sm"
                      name="brand_id"
                      id="brand_id"
                      onChange={handlChange}
                      value={formData.brand_id}
                    >
                      <option value="" selected="selected" disabled>
                        Select Brand
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Model No</label>
                    <input
                      className="form-control form-control-sm"
                      name="model_no"
                      placeholder="Model No"
                      type="text"
                      onChange={handlChange}
                      value={formData.model_no}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Purchase Date</label>
                    <input
                      className="form-control form-control-sm"
                      name="purchase_date"
                      // value={today}
                      value={formData.purchase_date}
                      placeholder="Purchase Date"
                      type="date"
                      onChange={handlChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Warranty From - To</label>

                    <div className="row">
                      <div className="col-6">
                        <input
                          className="form-control form-control-sm"
                          name="warranty_from"
                          //value={today}
                          value={formData.warranty_from}
                          placeholder="warranty from"
                          type="date"
                          onChange={handlChange}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control form-control-sm"
                          name="warranty_to"
                          //value={today}
                          value={formData.warranty_to}
                          placeholder="warranty to"
                          type="date"
                          onChange={handlChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">QR 1 & 2</label>

                    <div className="row">
                      <div className="col-6">
                        <input
                          className="form-control form-control-sm"
                          name="qr_1"
                          placeholder="QR-1"
                          type="text"
                          value={formData.qr_1}
                          onChange={handlChange}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control form-control-sm"
                          name="qr_2"
                          placeholder="QR-2"
                          type="text"
                          onChange={handlChange}
                          value={formData.qr_2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reason">Other</label>
                    <input
                      className="form-control form-control-sm"
                      name="other"
                      placeholder="Other"
                      type="text"
                      value={formData.other}
                      onChange={handlChange}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <table className="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th colSpan="10" className="text-center">
                          Accessories
                        </th>
                      </tr>
                      <tr>
                        <th>Accessories Name</th>
                        <th>Serial/Mac/Other</th>
                        <th>Type</th>
                        <th>Brand</th>
                        <th>Model Number</th>
                        <th>Warranty From</th>
                        <th>Warranty To</th>
                        <th>QR</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody id="addacc">
                      <tr></tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="accasset_name"
                            placeholder="Accessories Name"
                            onChange={acchandlChange}
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="accsl_number"
                            placeholder="Serial Number/Mac/Other"
                            onChange={acchandlChange}
                            type="text"
                          />
                        </td>
                        <td>
                          <select
                            className="form-control form-control-sm"
                            name="assetacc_type"
                            id="assetacc_type"
                            onChange={acchandlChange}
                          >
                            <option value="" selected="selected" disabled>
                              Select Type
                            </option>
                            <option value="Software">Software</option>
                            <option value="Hardware">Hardware</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="acc_brand"
                            placeholder="Brand"
                            type="text"
                            onChange={acchandlChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="acc_model"
                            placeholder="Model Number"
                            type="text"
                            onChange={acchandlChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="accwarranty_from"
                            value={today}
                            placeholder="warranty from"
                            type="date"
                            onChange={acchandlChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="accwarranty_to"
                            value={today}
                            placeholder="warranty to"
                            type="date"
                            onChange={acchandlChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            name="accqr_1"
                            placeholder="QR"
                            type="text"
                            onChange={acchandlChange}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={handleadd}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleClose_asset}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
        {/* </div> */}
        {/* </div> */}
      </Modal>
    </div>
  );
};
export default Assetmaster;
