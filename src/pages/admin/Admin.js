import { CWidgetStatsC } from "@coreui/react";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Delete, Edit, EditAttributesRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getBooking } from "../../api/booking";
import {
  addNewMovie,
  getAllMovies,
  removeMovie,
  updateMovieDetails,
} from "../../api/movie";
import {
  addNewTheater,
  deleteTheaterDetail,
  getAllTheaters,
  getTheaterById,
  updateTheaterDetails,
} from "../../api/theater";
import { getAllUsers, updateUserInfo } from "../../api/user";
import Navbar from "../../components/navbar/Navbar";
import { cities } from "../../util/Cities";
import "./Admin.css";

function Admin() {
  const [showTheaterTable, setShowTheaterTable] = useState(false);
  const [showMovieTable, setShowMovieTable] = useState(false);
  const [showBookingTable, setShowBookingTable] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);
  const [cinemaList, setCinemaList] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [addMovieModal, showAddMovieModal] = useState(false);
  const [updateMovieModal, showUpdateMovieModal] = useState(false);
  const [counterInfo, setCounterInfo] = useState({});
  const [updateTheaterModal, showUpdateTheaterModal] = useState(false);
  const [tempTheaterDetail, setTempTheaterDetail] = useState({});
  const [tempMovieDetail, setTempMovieDetail] = useState({});
  const [addTheaterModal, showAddTheaterModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetail, setUserDetail] = useState({});

  const refreshTheaters = async () => {
    const result = await getAllTheaters();
    setCinemaList(result.data);
    counterInfo.theater = result.data.length;
    setCounterInfo(counterInfo);
  };
  const clearState = () => {
    showUpdateTheaterModal(false);
    showAddTheaterModal(false);
    showAddMovieModal(false);
    showUpdateMovieModal(false);
    setUserModal(false);
    setTempTheaterDetail({});
    setTempMovieDetail({});
  };

  const refreshMovies = async () => {
    const movieResult = await getAllMovies();
    setMovieList(movieResult.data);
    counterInfo.movies = movieResult.data.length;
    setCounterInfo(counterInfo);
  };

  const refreshBookings = async () => {
    const bookingResponse = await getBooking();
    setBookingDetails(bookingResponse.data);
    counterInfo.booking = bookingResponse.data.length;
    setCounterInfo(counterInfo);
  };

  const refreshUsers = async () => {
    const userResult = await getAllUsers();
    setUserList(
      userResult.data.filter(
        (user) => user.userId !== localStorage.getItem("userId")
      )
    );
    counterInfo.userResult = userResult.data.length;
    setCounterInfo(counterInfo);
  };

  const deleteTheater = async (theater) => {
    await deleteTheaterDetail(theater);
    refreshTheaters();
  };
  const editTheater = async (cinema) => {
    const result = await getTheaterById(cinema._id);
    showUpdateTheaterModal(true);
    setTempTheaterDetail(result.data);

    refreshMovies();
  };

  const addTheater = async () => {
    showAddTheaterModal(true);
  };

  const addMovie = () => {
    showAddMovieModal(true);
  };
  const deleteMovie = async (movie) => {
    await removeMovie(movie);
    refreshMovies();
  };
  const editMovie = (movie) => {
    showUpdateMovieModal(true);
    setTempMovieDetail(Object.assign({}, movie));
  };
  const updateTempMovieDetail = (e) => {
    if (e.target.name === "name") tempMovieDetail.name = e.target.value;
    else if (e.target.name === "trailerUrl")
      tempMovieDetail.trailerUrl = e.target.value;
    else if (e.target.name === "description")
      tempMovieDetail.description = e.target.value;
    else if (e.target.name === "releaseStatus")
      tempMovieDetail.releaseStatus = e.target.value;
    else if (e.target.name === "director")
      tempMovieDetail.director = e.target.value;
    else if (e.target.name === "releaseDate")
      tempMovieDetail.releaseDate = e.target.value;
    else if (e.target.name === "language")
      tempMovieDetail.language = e.target.value;
    else if (e.target.name === "posterUrl")
      tempMovieDetail.posterUrl = e.target.value;

    setTempMovieDetail(Object.assign({}, tempMovieDetail));
  };
  const updateMovie = async (e) => {
    e.preventDefault();
    await updateMovieDetails(tempMovieDetail);
    showUpdateMovieModal(false);
    refreshMovies();
    clearState();
  };
  const newMovie = async (event) => {
    event.preventDefault();
    if (tempMovieDetail.releaseStatus === undefined)
      tempMovieDetail.releaseStatus = "RELEASED";
    await addNewMovie(tempMovieDetail);
    refreshMovies();
    clearState();
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
  const updateTheater = async (e) => {
    e.preventDefault();
    await updateTheaterDetails(tempTheaterDetail);
    refreshTheaters();
    clearState();
  };
  const newTheater = async (event) => {
    event.preventDefault();
    tempTheaterDetail.userId = "62a38a762f4e41d6b8b8f48";
    const response = await addNewTheater(tempTheaterDetail);
    if (response.status === 201) {
      refreshTheaters();
      clearState();
    } else {
      setErrorMessage(response.data.message);
    }
  };

  useEffect(() => {
    refreshTheaters();
    refreshMovies();
    refreshBookings();
    refreshUsers();
  }, []);

  const editUser = (user) => {
    setUserModal(true);
    setUserDetail(Object.assign({}, user));
  };
  const changeUserDetail = (e) => {
    if (e.target.name === "name") userDetail.name = e.target.value;
    else if (e.target.name === "userStatus")
      userDetail.userStatus = e.target.value;
    else if (e.target.name === "userType") userDetail.userType = e.target.value;

    setUserDetail(Object.assign({}, userDetail));
  };
  const updateUserDetail = async (event) => {
    event.preventDefault();
    await updateUserInfo(userDetail);
    refreshUsers();
    clearState();
  };

  const Cards = () => {
    return (
      <>
        <p className="text-center text-scendary">
          Take a look at your stats below
        </p>
        <div className="row">
          <div className="col">
            <CWidgetStatsC
              className="mb-3"
              icon={<i className="bi bi-building text-danger" />}
              color={showTheaterTable ? "success" : "dark"}
              inverse
              progress={{ value: counterInfo.movies }}
              text="Number of Theaters"
              title="Theaters"
              value={counterInfo.theater}
              onClick={() => setShowTheaterTable(!showTheaterTable)}
            />
          </div>
          <div className="col">
            <CWidgetStatsC
              className="mb-3"
              icon={<i className="bi bi-film text-danger" />}
              color={showMovieTable ? "success" : "dark"}
              inverse
              progress={{ value: counterInfo.movies }}
              text="Number of movies"
              title="Movies"
              value={counterInfo.movies}
              onClick={() => setShowMovieTable(!showMovieTable)}
            />
          </div>
          <div className="col">
            <CWidgetStatsC
              className="mb-3 mask flex-center"
              icon={<i className="bi bi-card-list text-danger" />}
              color={showBookingTable ? "success" : "dark"}
              inverse
              progress={{ value: counterInfo.booking }}
              text="Number of Bookings"
              title="Bookings"
              value={counterInfo.booking}
              onClick={() => setShowBookingTable(!showBookingTable)}
            />
          </div>
          <div className="col">
            <CWidgetStatsC
              className="mb-3"
              icon={<i className="bi bi-people text-danger" />}
              color={showUserTable ? "success" : "dark"}
              inverse
              progress={{ value: counterInfo.userResult }}
              text="Number of Uers"
              title="Users"
              value={counterInfo.userResult}
              onClick={() => setShowUserTable(!showUserTable)}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />

      <div className="container bg-light mt-2">
        <h3 className="text-center">
          Welcome, {localStorage.getItem("name")}!{" "}
        </h3>

        <Cards />

        {showTheaterTable ? (
          <>
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
                  icon: Delete,
                  tooltip: "Delete Theater",
                  onClick: (event, rowData) => deleteTheater(rowData),
                },
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
            <div className="text-center">
              <button onClick={addTheater} className="btn btn-danger m-2">
                Add Theater
              </button>
            </div>
          </>
        ) : (
          <> </>
        )}

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
        {showMovieTable ? (
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
              actions={[
                {
                  icon: Delete,
                  tooltip: "Delete Movie",
                  onClick: (event, rowData) => deleteMovie(rowData),
                },
                {
                  icon: Edit,
                  tooltip: "Edit Movie",
                  onClick: (event, rowData) => editMovie(rowData),
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
            <div className="text-center">
              <button onClick={addMovie} className="btn btn-danger m-2">
                Add Movie
              </button>
            </div>
          </>
        ) : (
          <> </>
        )}

        <Modal
          show={addMovieModal || updateMovieModal}
          onHide={clearState}
          backdrop="static"
          keyboard={false}
          centered
          size="lg md"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {updateMovieModal ? "EDIT MOVIE" : "ADD MOVIE"}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateMovieModal ? updateMovie : newMovie}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  value={tempMovieDetail.name}
                  className="form-control"
                  placeholder="Movie Name"
                  required
                  onChange={updateTempMovieDetail}
                />
              </div>

              <div className="input-grpup my-2">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <textarea
                  type="text"
                  name="description"
                  className="form-control"
                  value={tempMovieDetail.description}
                  placeholder="Description"
                  required
                  onChange={updateTempMovieDetail}
                />
              </div>
              <div className="d-flex">
                <div className="input-group me-1">
                  <span className="input-group-text">
                    <i className="bi bi-pencil"></i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    name="director"
                    value={tempMovieDetail.director}
                    placeholder="director"
                    required
                    onChange={updateTempMovieDetail}
                  />
                </div>
                <div className="input-group ms-1">
                  <span className="input-group-text">
                    <i className="bi bi-pencil"></i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    name="language"
                    value={tempMovieDetail.language}
                    placeholder="language"
                    required
                    onChange={updateTempMovieDetail}
                  />
                </div>
              </div>
              <div className="d-flex my-2">
                <div className="input-group me-1">
                  <span className="input-group-text">
                    <i className="b bi-link-45deg"></i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    name="posterUrl"
                    value={tempMovieDetail.posterUrl}
                    placeholder="posterUrl"
                    required
                    onChange={updateTempMovieDetail}
                  />
                </div>
                <div className="input-group me-1">
                  <span className="input-group-text">
                    <i className="b bi-link-45deg"></i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    name="trailerUrl"
                    value={tempMovieDetail.trailerUrl}
                    placeholder="trailerUrl"
                    required
                    onChange={updateTempMovieDetail}
                  />
                </div>
              </div>
              <div className="d-flex my-2">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <select
                  name="releaseStatus"
                  value={tempMovieDetail.releaseStatus}
                  onChange={updateTempMovieDetail}
                  required
                  className="form-select form-select-sm"
                >
                  <option value="RELEASED">RELEASED</option>
                  <option value="UNRELEASED">UNRELEASED</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>
              <div className="d-flex my-2">
                <span className="input-group-text">
                  <i className="bi bi-pencil"></i>
                </span>
                <input
                  className="form-control"
                  type="text"
                  name="releaseDate"
                  value={tempMovieDetail.releaseDate}
                  placeholder="releaseDate"
                  required
                  onChange={updateTempMovieDetail}
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
                    {updateMovieModal ? "OK" : "ADD MOVIE"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="text-danget text-center">{errorMessage}</div>
          </Modal.Body>
        </Modal>

        {showUserTable ? (
          <>
            <MaterialTable
              onRowClick={(event, rowData) => editUser(rowData)}
              data={userList}
              columns={[
                {
                  title: "USER ID",
                  field: "userId",
                },
                {
                  title: "Name",
                  field: "name",
                },
                {
                  title: "Email",
                  field: "email",
                  filtering: false,
                },
                {
                  title: "Release Date",
                  field: "releaseDate",
                },
                {
                  title: "ROLE",
                  field: "userType",
                  lookup: {
                    ADMIN: "ADMIN",
                    CUSTOMER: "CUSTOMER",
                    CLIENT: "CLIENT",
                  },
                },
                {
                  title: "Status",
                  field: "userStatus",
                  lookup: {
                    APPROVED: "APPROVED",
                    PENDING: "PENDING",
                    REJECTED: "REJECTED",
                  },
                },
              ]}
              options={{
                emptyRowsWhenPaging: false,
                filtering: true,
                actionsColumnIndex: -1,
                sorting: true,
                exportMenu: [
                  {
                    label: "Export PDF",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, datas, "User Records"),
                  },
                  {
                    label: "Export CSV",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "User Records"),
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
              title="USER RECORDS"
            />
          </>
        ) : (
          <> </>
        )}

        <Modal
          show={userModal}
          onHide={clearState}
          backdrop="static"
          keyboard={false}
          centered
          size="lg md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateUserDetail}>
              <div className="p-1">
                <h5 className="card-subtitle mb-2 text-primary lead">
                  User ID: {userDetail.userId}
                </h5>
                <hr />
                <div className="input-group mb-3">
                  <label className="label input-group-text label-md">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={userDetail.name}
                    onChange={changeUserDetail}
                  />
                </div>
                <div className="input-group mb-3">
                  <label className="label input-group-text label-md">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={userDetail.email}
                    onChange={changeUserDetail}
                  />
                </div>

                <div className="input-group mb-3">
                  <label className="label input-group-text label-md">
                    Type
                  </label>
                  <select
                    className="form-select"
                    name="userType"
                    value={userDetail.userType}
                    onChange={changeUserDetail}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="CLIENT">CLIENT</option>
                  </select>
                </div>
                <div className="input-group mb-3">
                  <label className="label input-group-text label-md">
                    STATUS
                  </label>
                  <select
                    className="form-select"
                    name="userStatus"
                    value={userDetail.userStatus}
                    onChange={changeUserDetail}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="input-group justify-content-center">
                <div className="m-1">
                  <Button variant="secondary" onClick={clearState}>
                    Close
                  </Button>
                </div>
                <div className="m-1">
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </div>
              </div>
            </form>
            <div className="text-danget text-center">{errorMessage}</div>
          </Modal.Body>
        </Modal>

        {showBookingTable ? (
          <>
            <MaterialTable
              data={bookingDetails}
              columns={[
                {
                  title: "BOOKING ID",
                  field: "_id",
                },
                {
                  title: "Booked At",
                  field: "createdAt",
                },
                {
                  title: "No of seats",
                  field: "noOfSeats",
                  filtering: false,
                },
                {
                  title: "Total Cost",
                  field: "totalCost",
                },
                {
                  title: "Booking Status",
                  field: "status",
                  lookup: {
                    IN_PROGRESS: "IN_PROGRESS",
                    COMPLETED: "COMPLETED",
                  },
                },
              ]}
              options={{
                emptyRowsWhenPaging: false,
                filtering: true,
                actionsColumnIndex: -1,
                sorting: true,
                exportMenu: [
                  {
                    label: "Export PDF",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, datas, "BOOKING Records"),
                  },
                  {
                    label: "Export CSV",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "BOOKING Records"),
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
              title="BOOKING RECORDS"
            />
          </>
        ) : (
          <> </>
        )}
      </div>
    </>
  );
}

export default Admin;
