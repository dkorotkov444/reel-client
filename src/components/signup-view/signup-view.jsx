/*  
 * src/components/signup-view/signup-view.jsx
 *
 * Signup View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries ---
import { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// --- Local application imports ---

// Signup view component
export const SignupView = () => {
    // State variables for the signup form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birth_date, setBirthDate] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the state of password visibility
    const handleToggle = () => setShowPassword(!showPassword);


    const handleSubmit = (event) => {
        // This prevents the default behavior of the form which is to reload the entire page
        event.preventDefault();

        // Prepare data for API request
        const data = {
            username: username,
            password: password,
            email: email,
            birth_date: birth_date
        };

        // Send signup request to API
        fetch("https://reel-movie-api-608b8b4b3a04.herokuapp.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),})
        .then((response) => response.json())
        .then((/* data */) => {
            window.location.reload(); // Reload the page to show the login view
        })
        .catch((error) => {
            console.error("Signup error: ", error);
            alert("An error occurred during signup");
        });
    };

    // Rendering the signup form
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
                        minLength="5"
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
                            minLength="8"
                            autoComplete="new-password"
                        />
                        <InputGroup.Text onClick={handleToggle} style={{ cursor: 'pointer' }}>
                            {showPassword ? <EyeSlash /> : <Eye />}     {/* Dynamic icon */}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </Form.Group>

                <Form.Group controlId="formBirthDate">
                    <Form.Label>Birth date: </Form.Label>
                    <Form.Control
                        type="date"
                        value={birth_date}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </Form.Group>

                {/* For optics: wrap the button in d-flex justify-content-end */}
                <div className="d-flex flex-column align-items-end mt-3">
                    <Button className="ms-auto" variant="primary" type="submit">Sign up</Button>
                </div>

            </Form>

            {/* Link to Login view */}
            <div className="text-end mt-2">
                <Link to="/login">Already have an account? Log in</Link>
            </div>
        </>
    );
};
