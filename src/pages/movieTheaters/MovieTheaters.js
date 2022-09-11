import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../../api/movie";
import { getAllTheaters } from "../../api/theater";
import Navbar from "../../components/navbar/Navbar";

function MovieTheaters() {
  const [movieDetail, setMovieDetails] = useState({});
  const [theatersDetail, setTheaterDetails] = useState({});
  const [pageLoaded, setPageLoading] = useState(false);
  const { movieid: selectedMovieId } = useParams();

  useEffect(() => {
    const init = async () => {
      let response = await getAllTheaters();
      setTheaterDetails(
        response.data.filter((data) => {
          return data.movies.includes(selectedMovieId);
        })
      );
      response = await getMovie(selectedMovieId);
      setMovieDetails(response.data);
      setPageLoading(true);
    };
    init();
  }, [selectedMovieId]);

  return (
    <div>
      <Navbar />
      <div className="bg-light">
        <div className="bg-black text-center py-3 backg">
          <h2 className="fw-bolder text0light"> {movieDetail.name}</h2>
          <span className="badge rounded-pill text-bg-danger m-1">
            {movieDetail.description}{" "}
          </span>
          <span className="badge rounded-pill text-bg-secondary m-1">
            {movieDetail.language}{" "}
          </span>
          <span className="badge rounded-pill text-bg-secondary m-1">
            {movieDetail.releaseStatus}{" "}
          </span>

          <hr />
          <h6 className="text-muted"> Director: {movieDetail.director} </h6>
          <h6 className="text-muted">
            {" "}
            Release Date: {movieDetail.releaseDate}{" "}
          </h6>
        </div>

        <div className="container my-3 vh-100">
          <h2 className="fw-bold text-dark text-center"> SELECT THEATER</h2>
          {pageLoaded
            ? theatersDetail.map((theater) => (
                <li key={theater.name} className="list-group-item">
                  <Link
                    key={theater._id}
                    to={`/movie/${selectedMovieId}/${theater._id}`}
                    className="fw-bold text-decoration-none p-2"
                  >
                    <div className="row">
                      <div className="col">{theater.name}</div>
                      <div className="col">
                        <div className="p-2 text-success fw-bold">
                          <i className="bi bi-phone-fill text-success"></i>
                          m-Ticket
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-2 text-danger fw-bold">
                          <i className="bi bi-cup-straw text-danger"></i>
                          Food and Beverages
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}

export default MovieTheaters;
