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
// Import React Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// --- Local application imports ---

// Signup view component
export const SignupView = ({ onLoggedIn }) => {
    // State variables for the signup form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birth_date, setBirthDate] = useState("");

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
        <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formUsername">
                <Form.Label>Username: </Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    autoComplete="off"
                />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label>Password: </Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                    autoComplete="new-password"
                />
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

            <Button variant="primary" type="submit">Submit</Button>

        </Form>
    );
};
