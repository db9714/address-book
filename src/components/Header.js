import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import image from "../assets/images/address.jpg";
function Header(props) {
  let history = useHistory();

  function didClickNavigate(path) {
    if (props.active !== path) history.push(path);
  }
  return (
    <>
      <div style={{ margin: 0, padding: 0 }}>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="dashboard" onClick={() => didClickNavigate("/dashboard")}>
            <img style={{ height: 50 }} src={image} alt="logo" />
            Address Book
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => didClickNavigate("/dashboard")}>Add Contact</Nav.Link>
              <Nav.Link onClick={() => didClickNavigate("/contacts")}>View All Contact</Nav.Link>
              <Nav.Link onClick={() => didClickNavigate("/changepassword")}>Change Password</Nav.Link>

              <Nav.Link
                onClick={() => {
                  localStorage.setItem("token", "");
                  history.push("/");
                }}
              >
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}
export default Header;
