import { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    fetch("https://reel-movie-api-608b8b4b3a04.herokuapp.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),})
    .then((response) => response.json())
    .then((data) => {
        console.log("Login response: ", data);
        if (data.username) {
            localStorage.setItem("username", JSON.stringify(data.username));    // Store username in local storage
            localStorage.setItem("token", data.token);                          // Store JWT token in local storage
            onLoggedIn(data.username, data.token);                        // Notify parent component (MainView) about successful login
        } else {
            alert("User does not exist");
        }
    })
    .catch((error) => {
        console.error("Login error: ", error);
        alert("An error occurred during login");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};