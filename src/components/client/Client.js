import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api/movie";
import {
  addNewTheater,
  getAllTheaters,
  getTheaterById,
  updateTheaterDetails,
} from "../../api/theater";
import Navbar from "../navbar/Navbar";
import { cities } from "../../util/Cities";
import { Button, Modal } from "react-bootstrap";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Edit } from "@material-ui/icons";

function Client() {
  const [cinemaList, setCinemaList] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [addTheaterModal, showAddTheaterModal] = useState(false);
  const [updateTheaterModal, showUpdateTheaterModal] = useState(false);
  const [tempTheaterDetail, setTempTheaterDetail] = useState({});
  const [counterInfo, setCounterInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState(false);

  const refreshTheaters = async () => {
    const result = await getAllTheaters();
    setCinemaList(result.data);
    counterInfo.theater = result.data.length;
  };
  const refreshMovies = async () => {
    const movieResult = await getAllMovies();
    setMovieList(movieResult.data);
    counterInfo.movies = movieResult.data.length;
  };

  useEffect(() => {
    refreshTheaters();
    refreshMovies();
  }, []);

  const editTheater = async (cinema) => {
    const result = await getTheaterById(cinema._id);
    showUpdateTheaterModal(true);
    setTempTheaterDetail(result.data);
  };
  const newTheater = async (event) => {
    event.preventDefault();
    tempTheaterDetail.userId = "62a38a762f4e41d6b8b8f48";
    await addNewTheater(tempTheaterDetail);
    refreshTheaters();
    clearState();
  };
  const updateTheater = async (e) => {
    e.preventDefault();
    await updateTheaterDetails(tempTheaterDetail);
    refreshTheaters();
    clearState();
  };
  const clearState = () => {
    showUpdateTheaterModal(false);
    showAddTheaterModal(false);
    setTempTheaterDetail({});
  };
  const updateTempTheaterDetail = (e) => {
    if (e.target.name === "name") tempTheaterDetail.name = e.target.value;
    else if (e.target.name === "city") tempTheaterDetail.city = e.target.value;
    else if (e.target.name === "description")
      tempTheaterDetail.description = e.target.value;
    else if (e.target.name === "pinCode")
      tempTheaterDetail.pinCode = e.target.value;
    setTempTheaterDetail(Object.assign({}, tempTheaterDetail));
    setErrorMessage("");
  };

  return (
    <>
      <Navbar />
      <div className="container bg-light mt-2">
        <h3 className="text-center">
          Welcome, {localStorage.getItem("name")}!{" "}
        </h3>
        <p className="text-center text-secondary">
          Take a quick look at your stats
        </p>

        <div className="my-2">
          <MaterialTable
            title="Theaters"
            data={cinemaList}
            columns={[
              {
                title: "Theater Name",
                field: "name",
              },
              {
                title: "City",
                field: "city",
              },
              {
                title: "Descriptions",
                field: "description",
                filtering: false,
              },
              {
                title: "Pin Code",
                field: "pinCode",
              },
            ]}
            actions={[
              {
                icon: Edit,
                tooltip: "Edit Theater",
                onClick: (event, rowData) => editTheater(rowData),
              },
            ]}
            options={{
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              sorting: true,
              exportMenu: [
                {
                  label: "Export PDF",
                  exportFunc: (cols, datas) =>
                    ExportPdf(cols, datas, "Theater Records"),
                },
                {
                  label: "Export CSV",
                  exportFunc: (cols, datas) =>
                    ExportCsv(cols, datas, "Theater Records"),
                },
              ],
              headerStyle: {
                backgroundColor: "#202429",
                color: "white",
              },
              rowStyle: {
                backgroundColor: "#eee",
              },
            }}
          />
        </div>

        <Modal
          show={addTheaterModal || updateTheaterModal}
          onHide={clearState}
          backdrop="static"
          keyboard={false}
          centered
          size="lg md"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {updateTheaterModal ? "EDIT THEATERS" : "ADD THEATERS"}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateTheaterModal ? updateTheater : newTheater}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  value={tempTheaterDetail.name}
                  placeholder="Theater Name"
                  required
                  onChange={updateTempTheaterDetail}
                />
              </div>
              <select
                name="city"
                className="form-select form-select-sm"
                value={tempTheaterDetail.city}
                onChange={updateTempTheaterDetail}
              >
                <option>Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="input-grpup my-2">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <textarea
                  type="text"
                  name="description"
                  value={tempTheaterDetail.description}
                  placeholder="Description"
                  required
                  onChange={updateTempTheaterDetail}
                  className="form-control"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <input
                  type="text"
                  name="pinCode"
                  value={tempTheaterDetail.pinCode}
                  placeholder="PinCode"
                  required
                  onChange={updateTempTheaterDetail}
                />
              </div>
              <div className="input-group justify-content-center">
                <div className="m-1">
                  <Button variant="danger" onClick={clearState}>
                    Cancel
                  </Button>
                </div>
                <div className="m-1">
                  <Button type="submit" variant="dark">
                    {updateTheaterModal ? "EDIT THEATER" : "ADD THEATER"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="text-danget text-center">{errorMessage}</div>
          </Modal.Body>
        </Modal>

        {/* -------------Movies Section ----------- */}
        <>
          <MaterialTable
            title="MOVIES"
            data={movieList}
            columns={[
              {
                title: "",
                field: "img",
                render: (item) => (
                  <img
                    src={item.posterUrl}
                    alt=""
                    border="3"
                    height="100"
                    width="100"
                  />
                ),
              },
              {
                title: "Movie Name",
                field: "name",
              },
              {
                title: "Director",
                field: "director",
              },
              {
                title: "Release Date",
                field: "releaseDate",
              },
              {
                title: "Release Status",
                field: "releaseStatus",
              },
            ]}
            options={{
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              sorting: true,
              exportMenu: [
                {
                  label: "Export PDF",
                  exportFunc: (cols, datas) =>
                    ExportPdf(cols, datas, "Movie Records"),
                },
                {
                  label: "Export CSV",
                  exportFunc: (cols, datas) =>
                    ExportCsv(cols, datas, "Movie Records"),
                },
              ],
              headerStyle: {
                backgroundColor: "#202429",
                color: "white",
              },
              rowStyle: {
                backgroundColor: "#eee",
              },
            }}
          />
        </>
      </div>
    </>
  );
}

export default Client;
