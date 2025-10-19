import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar
      expand="lg"
      bg="light"
      className="border-bottom shadow-sm py-3 w-100"
      style={{ width: "100vw", left: 0, right: 0 }}
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold text-danger">
          Joe<span className="text-dark">Page</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "text-danger fw-semibold" : "text-dark")
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/DestinationMap"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "text-danger fw-semibold" : "text-dark")
              }
            >
              Visited Destination Map
            </NavLink>
            <NavLink
              to="/MiniApps"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "text-danger fw-semibold" : "text-dark")
              }
            >
              Mini Apps
            </NavLink>
            <NavLink
              to="/AboutMe"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "text-danger fw-semibold" : "text-dark")
              }
            >
              About Me
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
