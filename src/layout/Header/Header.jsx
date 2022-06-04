import React, { useContext, } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { USER_ROLE } from "../../constants/user";
import { UserContext } from "../../context/UserContext/UserContext";

export default function Header() {
  const { user, setUser } = useContext(UserContext)

  const logoutHandler = () => {
    setUser({});
  }

  const renderMenu = () => {
    if (!!user.id && USER_ROLE[user.role] === USER_ROLE.ADMIN) {
      return (
        <>
          <NavDropdown title="Users" id="users-nav-dropdown">
            <NavDropdown.Item as={Link} to="/users"> Users List </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/user/create"> Create User </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Cars" id="cars-nav-dropdown">
            <NavDropdown.Item as={Link} to="/cars"> Cars List </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/car/create"> Create Car </NavDropdown.Item>
          </NavDropdown>
          <NavLink className="nav-link" to="/" onClick={logoutHandler}> Logout </NavLink>
        </>
      )
    }
    else if (!!user.id) {
      return (
        <>
          <NavLink className="nav-link" to="/cars"> Cars List </NavLink>
          <NavLink className="nav-link" to="/" onClick={logoutHandler}> Logout </NavLink>
        </>
      )
    }
    else {
      return (
        <>
          <NavLink className="nav-link" to="/login"> Login </NavLink>
          <NavLink className="nav-link" to="/register"> Register </NavLink>
        </>
      )
    }
  }

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <NavLink className="navbar-brand" to="/">
          Rent A Car
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink className="nav-link" to="/"> Home </NavLink>
            <NavLink className="nav-link" to={`/bookings/${user.id}`}> My Bookings </NavLink>
            {renderMenu()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
