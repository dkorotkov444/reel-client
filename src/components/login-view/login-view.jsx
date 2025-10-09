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
// --- Local application imports ---

// Login view component
export const LoginView = ({ onLoggedIn }) => {
    // State variables for the login form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
            // Handle cases where username might be under different keys in the response
            const username = data?.username || data?.user?.username || null;
            const token = data?.token || null;
            if (username) {
                localStorage.setItem("username", JSON.stringify(username));    // Store username in local storage
                localStorage.setItem("token", token);                          // Store JWT token in local storage
                onLoggedIn(username, token);                        // Notify parent component (MainView) about successful login
            } else {
                alert("User does not exist");
            }
        })
        .catch((error) => {
            console.error("Login error: ", error);
            alert("An error occurred during login");
        });
    };

    // Rendering the login form
    return (
        <form onSubmit={handleSubmit}>
        <label>
            Username:
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
            autoComplete="new-password"
            />
        </label>
        <button type="submit">Submit</button>
        </form>
    );
};