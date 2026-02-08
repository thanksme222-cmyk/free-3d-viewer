// Import React
import React from "react";

// Import the Viewer3D component we just created
import Viewer3D from "./components/Viewer3D";

// Main App component
function App() {
  return (
    <div>
      {/* Render the 3D Viewer */}
      <Viewer3D />
    </div>
  );
}

// Export the App component as default
export default App;
