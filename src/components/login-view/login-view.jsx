/*  
 * src/components/login-view/login-view.jsx
 *
 * Login View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { useState } from "react";
import {Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// --- Local application imports (none required) ---

// Login view component
export const LoginView = ({ onLoggedIn }) => {
    // State variables for the login form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the state of password visibility
    const handleToggle = () => setShowPassword(!showPassword);

    const handleSubmit = (event) => {
        // This prevents the default behavior of the form which is to reload the entire page
        event.preventDefault();

        fetch("https://reel-movie-api-608b8b4b3a04.herokuapp.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            // data.user is now the publicProfile (full user object minus password)
            const user = data?.user || null;
            const token = data?.token || null;
            if (user && token) {
                // Store the full user object and token in local storage
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                // Pass the full user object and token to the parent component (MainView)
                onLoggedIn(user, token);     
            } else {
                alert(data?.message || "User does not exist");
            }
        })
        .catch((error) => {
            console.error("Login error: ", error);
            alert("An error occurred during login");
        });
    };

    // Rendering the login form
    return (
        <>
            {/* Welcome heading */}
            <Row className="justify-content-center mb-4">
                {/* The Col is set to center the text and take up the full width (12) on all screen sizes */}
                <Col xs={12} className="text-center"> 
                    <h1 className="display-8 mb-0">
                        Welcome to
                    </h1>
                    <h1 className="display-1 fw-bold" style={{ lineHeight: '1.2' }}>
                        REEL
                    </h1>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formUsername">
                <Form.Label>Username: </Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password: </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"} // Dynamic type based on state
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <InputGroup.Text onClick={handleToggle} style={{ cursor: 'pointer' }}>
                            {showPassword ? <EyeSlash /> : <Eye />}     {/* Dynamic icon */}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                {/* For optics: wrap the button in d-flex justify-content-end */}
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" type="submit">Login</Button>
                </div>

            </Form>
            
            {/* Link to Signup view */}
            <div className="text-end mt-2"> 
                <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
        </>
    );
};