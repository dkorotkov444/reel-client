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
        .then((data) => {
            window.location.reload(); // Reload the page to show the login view
        })
        .catch((error) => {
            console.error("Signup error: ", error);
            alert("An error occurred during signup");
        });
    };

    // Rendering the signup form
    return (
        <form onSubmit={handleSubmit}>

        <label>
            Username:
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            autoComplete="off"
            />
        </label>

        <label>
            Password:
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            autoComplete="new-password"
            />
        </label>
        
        <label>
            Email:
            <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            />
        </label>

        <label>
            Birth date:
            <input
            type="date"
            value={birth_date}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            autoComplete="off"
            />
        </label>

        <button type="submit">Submit</button>
        </form>
    );
};