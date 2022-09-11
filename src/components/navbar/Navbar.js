import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CButton } from "@coreui/react";
import { signOut } from "../../api/auth";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/");
  };
  return (
    <>
      <div className="container-fluid bg-dark sticky-top">
        <div className="row text-center">
          <div className="col-lg-2 col-sm-12">
            <Link className="text-decoration-none" to="/">
              <div className="display-6 text-danger py-1">MBA</div>
            </Link>
          </div>
          <div className="col-lg-8 col-sm-8 py-2"></div>
          <div className="col-lg-2 p-2 col-sm-4">
            {!localStorage.getItem("token") ? (
              <CButton
                type="submit"
                color="danger"
                className="px-3"
                onClick={() => (window.location.href = "/login")}
              >
                Login/Signup
              </CButton>
            ) : (
              <CButton
                type="submit"
                color="danger"
                className="px-3"
                onClick={logout}
              >
                Logout
              </CButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
