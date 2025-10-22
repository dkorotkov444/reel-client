/*  
 * src/components/navigation-bar/navigation-bar.jsx
 *
 * Navigation bar component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import PropTypes from "prop-types";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

// --- Local application imports (none required) ---

export const NavigationBar = ({ user, onLoggedOut }) => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary align-items-end">
            <Container>
                <Navbar.Brand href="/">REEL Movies Application</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    {/* Logged In Navigation (Home/Profile - Left Aligned) */}
                    {user && (
                        <Nav className="ms-3 me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                        </Nav>
                    )}

                    {/* Logged Out Navigation (Login/Signup - Right Aligned) 
                        FIX: This block uses ms-auto to push itself and its contents to the far right 
                        when the user is not logged in.
                    */}
                    {!user && (
                        <Nav className="ms-auto"> 
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                        </Nav>
                    )}

                    {/* Logout Link (Right Aligned, visible only when logged in) 
                        This Nav.Link is outside the main Nav to ensure it  aligns right using the ms-auto class. */}
                    {user && (
                        <Nav.Link onClick={onLoggedOut} className="ms-auto text-primary">Logout</Nav.Link>
                    )}

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

// Prop types for validation (optional here)
NavigationBar.propTypes = {
    user: PropTypes.object,
    onLoggedOut: PropTypes.func.isRequired
};

