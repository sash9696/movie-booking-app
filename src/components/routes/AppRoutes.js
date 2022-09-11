import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../../pages/auth/Auth";
import LandingPage from "../../pages/landingPage/LandingPage";
import Admin from "../../pages/admin/Admin";
import Client from "../client/Client";
import MovieDetail from "../../pages/movieDetail/MovieDetail";
import MovieTheaters from "../../pages/movieTheaters/MovieTheaters";
import Booking from "../../pages/booking/Booking";
import Notfound from "../../util/Notfound";
import Unauthorized from "../../util/Unauthorized";
import RequireAuth from "../../util/RequireAuth";

const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Auth />} />

        <Route exact path="/" element={<LandingPage />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.CLIENT]} />}>
          <Route path="/client" element={<Client />} />
        </Route>

        <Route path="/movie/:movieid/details" element={<MovieDetail />} />
        <Route
          path="/buytickets/:moviename/:movieid"
          element={<MovieTheaters />}
        />
        <Route path="/movie/:movieid/:theatreid" element={<Booking />} />

        <Route path="/*" element={<Notfound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
