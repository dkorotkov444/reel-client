/*  src/index.jsx
 * Application entry for the REEL Movie App
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { createRoot } from 'react-dom/client';

// --- Local application imports ---
import { MainView } from "./components/main-view/main-view";
import { Footer } from "./components/footer/footer";
// Import statement to indicate the need to bundle `./index.scss`
import "./index.scss";

// Clear local storage on app start
localStorage.clear(); 

// Main component (will eventually use all the others)
const ReelApplication = () => {
  return (
    <>
      <MainView />
      <Footer />
    </>
  );
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<ReelApplication />);