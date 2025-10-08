import { useState } from "react";

export const SignupView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");

  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

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
        console.log("Signup response: ", data);
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
        />
      </label>
      
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Birth date:
        <input
          type="date"
          value={birth_date}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};