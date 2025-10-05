/* src/components/footer/footer.jsx
 * Minimal footer component with TMDb attribution
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries ---
import React from 'react';

// --- Local application imports ---

export const Footer = () => {
  return (
    <footer style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
      Poster images provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a>
    </footer>
  );
};
