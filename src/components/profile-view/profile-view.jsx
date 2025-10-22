/* 
 * src/components/profile-view/profile-view.jsx
 *
 * User Profile view
 * 
 * Favorite movies are rendered with a React Bootstrap carousel.
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { useState } from "react";
import { Form, Button, Card, Carousel, Col, Row, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card"; 

export const ProfileView = ({ user, token, movies, onLoggedOut, onUserUpdate, onToggleFavorite }) => {
    
    // State for user update form
    const [formData, setFormData] = useState({
        username: user.username,
        password: "", 
        email: user.email,
        birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : "" 
    });
    
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Filter favorite movies based on the user's 'favorites' array
    const favoriteMovies = movies.filter(m => user.favorites && user.favorites.includes(m._id));

    // Function to chunk the array for the carousel
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    // Chunk the favorite movies into slides (e.g., 4 movies per slide)
    const moviesPerSlide = 4; 
    const movieSlides = chunkArray(favoriteMovies, moviesPerSlide);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle user profile update
    const handleUpdate = (event) => {
        event.preventDefault();

        // Build a payload with ONLY the fields that have been changed
        const dataToUpdate = {};
        // Prepare the trimmed stored date for comparison with formData.birth_date (YYYY-MM-DD)
        const trimmedUserBirthDate = user.birth_date 
            ? new Date(user.birth_date).toISOString().split('T')[0] 
            : "";

        if (formData.username !== user.username) dataToUpdate.newUsername = formData.username;
        if (formData.password) dataToUpdate.newPassword = formData.password; 
        if (formData.email !== user.email) dataToUpdate.newEmail = formData.email;
        if (formData.birth_date && formData.birth_date !== trimmedUserBirthDate) {
            dataToUpdate.newBirthDate = formData.birth_date;
        } 

        // If no fields have changed, alert the user and return
        if (Object.keys(dataToUpdate).length === 0) {
            alert("No changes to update.");
            return;
        }
        
        fetch(`https://reel-movie-api-608b8b4b3a04.herokuapp.com/users/${user.username}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dataToUpdate)
        })
        .then(async(response) => {
            if (response.ok) {  
                //SUCCESS PATH: if the response status is 200-299 (ok)
                return response.json();
            }
            //FAILURE PATH: The stream is read ONCE as plain text to catch all error types (409, 422, 500 crashes).
            const errorText = await response.text();
            // Clean the error message text from the server's "Error: " prefix
            const cleanedErrorText = errorText.startsWith("Error: ") 
                ? errorText.substring(7).trim() // Removes "Error: "
                : errorText;
            // Throw an error using the detailed text from the server
            throw new Error(cleanedErrorText || response.statusText);
        })
        .then(updatedUser => {
            /*
             * Security policy:
             * - Non-sensitive updates (email, birth_date) return updated user and keep the session.
             * - Sensitive updates (username, password) revoke the current JWT on the backend and force logout in frontend.
             */
            if (dataToUpdate.newPassword || dataToUpdate.newUsername) {
                alert("Username/password changed. You'll be logged out for security.");
                // Clear session in parent (MainView will redirect to /login)
                onLoggedOut();
                return;
            }

            // Non-sensitive updates: update parent state and refresh local form
            alert("Profile updated successfully!");
            onUserUpdate(updatedUser); // Update state in MainView
            // Refresh local form state from the returned user object
            setFormData({
                username: updatedUser.username,
                password: "",
                email: updatedUser.email,
                birth_date: updatedUser.birth_date ? new Date(updatedUser.birth_date).toISOString().split('T')[0] : ""
            });
        })
        .catch(error => {
            console.error("Profile update error: ", error);
            // Optional: ensure the alert is clean in case the server message changes
            const displayMessage = error.message.startsWith("Error: ")
                ? error.message.substring(7).trim()
                : error.message;
            alert(`Update failed: ${displayMessage}`);

            // Reset the form state back to the PROPS (last known good state)
            // This forces a clean re-render with the valid user data, preventing the crash.
            setFormData({
                username: user.username, 
                password: "", // Always clear the password field after any attempt
                email: user.email,
                birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : "" 
            });
        });
    };

    // Handle user deregistration
    const handleDeregister = () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        fetch(`https://reel-movie-api-608b8b4b3a04.herokuapp.com/users/${user.username}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.ok) {
                alert("Account deleted successfully.");
                onLoggedOut(); 
            } else {
                throw new Error("Failed to delete account.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Deletion failed.");
        });
    };

    return (
        <Row className="gy-4">
            {/* --- Update Form Card (single card, left aligned) --- */}
            <Col md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>Update Information</Card.Title>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username: </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    minLength="5"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>New Password: </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password (min 8 chars)"
                                        minLength="8"
                                        autoComplete="new-password"
                                    />
                                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </InputGroup.Text>
                                </InputGroup>
                                <Form.Text muted>Leave blank to keep current password.</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email: </Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBirthday">
                                <Form.Label>Birthday: </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <div className="d-flex flex-column align-items-end gap-2 mt-3">
                                <Button variant="primary" type="submit">Update</Button>
                                <Button variant="link" className="text-danger" onClick={handleDeregister}>
                                    Remove account permanently
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            
            {/* --- Favorite Movies Section --- */}
            <Col xs={12}>
                <h2 className="mt-5">My Favorite Movies</h2>
                <Row className="g-4">
                    {favoriteMovies.length > 0 ? (
                        <Carousel 
                            interval={null}     // Optional: set to null to disable auto-slide
                            indicators={true}   // Optional: display slide indicators
                            className="w-100 carousel-dark favorites-carousel"   // Scoped class for custom control placement
                        >
                            {/* Iterate over the movie slides (chunks) */}
                            {movieSlides.map((slide, slideIndex) => (
                                <Carousel.Item key={slideIndex}>
                                    {/* Use Row/Col inside Carousel.Item to display the cards */}
                                    <Row className="g-4 pb-5 justify-content-center"> {/* Add pb-5 for indicator space */}
                                        {slide.map(movie => (
                                            <Col className="mb-4" key={movie._id} lg={3} md={4} sm={6}>
                                                <MovieCard
                                                    movie={movie}
                                                    onToggleFavorite={onToggleFavorite}
                                                    isFavorite={true}
                                                    navState={{ from: "/profile" }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <Col>
                            <p>You haven't added any favorite movies yet. Head back to the <Link to="/">home page</Link> to add some!</p>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};

// Prop types validation for ProfileView
ProfileView.propTypes = {
    user: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    movies: PropTypes.array.isRequired,
    onLoggedOut: PropTypes.func.isRequired,
    onUserUpdate: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
};