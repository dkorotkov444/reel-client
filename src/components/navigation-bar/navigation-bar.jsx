/*  
 * src/components/navigation-bar/navigation-bar.jsx
 *
 * Navigation bar component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

// --- Local application imports (none required) ---

export const NavigationBar = ({ user, onLoggedOut }) => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary align-items-end">
            <Container>
                <Navbar.Brand href="/">REEL Movie Application</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-3 me-auto">
                        {!user && (
                            <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                            </>
                        )}
                        {user && (
                            <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

                            </>
                        )}
                    </Nav>
                    {user && (
                        <Nav.Link onClick={onLoggedOut} className="ms-auto text-primary">Logout</Nav.Link>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
  };
  
