import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Loader from "../../assets/load.gif";
import { getAllMovies } from "../../api/movie";
import Slider from "../../components/slider/Slider";
import { Link } from "react-router-dom";

function LandingPage() {
  const [movieList, setMovieList] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const init = async () => {
    const result = await getAllMovies();
    console.log(result);
    setMovieList(result.data);
    setPageLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  const render = () => {
    return (
      <>
        <Navbar />
        {!pageLoading ? (
          <>
            <Slider />
            <div className="container my-4">
              <p className="fw-bolder">Recommended Movies</p>
              <div className="row">
                {movieList?.map((movie) => (
                  <div className="col-lg-3 col-xs-6 my-2" key={movie._id}>
                    <Link key={movie._id} to={`/movie/${movie._id}/details`}>
                      <div
                        className="d-flex align-items-stretch"
                        style={{ height: 25 + "rem" }}
                      >
                        <div
                          className="card bg-dark shawdow-ld"
                          style={{ height: 24 + "rem" }}
                        >
                          <img
                            src={movie.posterUrl}
                            alt="..."
                            style={{ height: "80%" }}
                          />
                          <i className="bi bi-hand-thumbs-up-fill text-success px-2">
                            58K
                          </i>
                          <p className="text-white fw-bolder px-2">
                            {movie.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <img src={Loader} alt="Loading..." />
          </div>
        )}
        {/* <Footer/> */}
      </>
    );
  };

  return render();
}

export default LandingPage;
