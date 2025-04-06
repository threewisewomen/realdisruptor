import type { NextPage } from "next";
import React, { useState, useMemo } from "react";

// --- Configuration ---
// !!! REPLACE THIS WITH THE ACTUAL YOUTUBE VIDEO ID !!!
// Example: If the URL is https://www.youtube.com/watch?v=abcdef12345
// The VIDEO_ID is "abcdef12345"
const YOUTUBE_VIDEO_ID_PLACEHOLDER = "zZ7AimPACzc";
// Recommended: Mute video for reliable autoplay in browsers
const AUTOPLAY_MUTED = true;

const SubwaySliderPage: NextPage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);
  const closePanel = () => setIsPanelOpen(false);

  // Construct the YouTube embed URL only once
  const embedUrl = useMemo(() => {
    if (YOUTUBE_VIDEO_ID_PLACEHOLDER === "YOUR_YOUTUBE_VIDEO_ID_HERE") {
      return null; // Don't construct if placeholder is still there
    }
    return `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID_PLACEHOLDER}?autoplay=1&loop=1&controls=0&playlist=${YOUTUBE_VIDEO_ID_PLACEHOLDER}${
      AUTOPLAY_MUTED ? "&mute=1" : ""
    }&playsinline=1`;
    // Added playsinline=1 which can help on mobile iOS
  }, [YOUTUBE_VIDEO_ID_PLACEHOLDER]); // Recompute only if placeholder changes

  // Combine base styles with conditional transform style for the panel
  const panelStyle: React.CSSProperties = {
    ...styles.slidePanelBase, // Apply base positioning, size, transition etc.
    transform: isPanelOpen ? "translateX(0%)" : "translateX(-100%)", // Slide in or out
  };

  return (
    <div style={styles.pageContainer}>
      {/* Optional: Content behind the panel can go here */}

      {/* Sliding Panel */}
      <div style={panelStyle}>
        {/* Close button inside the panel */}
        <button onClick={closePanel} style={styles.closeButton}>
          × {/* HTML entity for 'X' */}
        </button>

        {/* Panel Content */}
        <div style={styles.panelContent}>
          {embedUrl ? (
            <iframe
              style={styles.videoIframe}
              src={isPanelOpen ? embedUrl : ""} // Load src only when open to prevent premature load/play
              title="Subway Surfers Gameplay"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <div style={styles.placeholderText}></div>
          )}
        </div>
      </div>

      {/* Button fixed at the bottom right */}
      <button onClick={togglePanel} style={styles.subwayButton}>
        Subway
      </button>
    </div>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#e9ecef", // Lighter gray background
    position: "relative", // Needed for absolute positioning children if required
    overflowX: "hidden", // Prevent horizontal scrollbar caused by the hidden panel
  },
  subwayButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1050, // Ensure button is above closed panel, but could be below open panel if needed
    transition: "background-color 0.2s ease",
  },
  // Base styles for the panel (always applied)
  slidePanelBase: {
    position: "fixed",
    top: 0,
    left: 0, // Start anchored to the left
    height: "100vh", // Full viewport height
    width: "90%", // Take up most of the width on small screens
    maxWidth: "500px", // Limit width on larger screens
    backgroundColor: "#343a40", // Dark background for the panel
    boxShadow: "5px 0px 15px rgba(0, 0, 0, 0.3)",
    zIndex: 1000, // Ensure panel is above page content
    transition: "transform 0.4s ease-in-out", // Smooth sliding animation
    display: "flex",
    flexDirection: "column", // Stack close button and content vertically
  },
  closeButton: {
    position: "absolute", // Position relative to the panel
    top: "15px",
    right: "15px",
    background: "rgba(255, 255, 255, 0.15)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    fontSize: "22px",
    lineHeight: "33px",
    textAlign: "center",
    cursor: "pointer",
    zIndex: 1010, // Above panel content
    transition: "background-color 0.2s ease",
  },
  // Container for the main content within the panel (iframe)
  panelContent: {
    flexGrow: 1, // Allow this area to take remaining vertical space
    padding: "20px",
    paddingTop: "60px", // Add padding to avoid overlap with close button
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Hide anything overflowing the content area
    height: "100%", // Try to take full height within flex container
  },
  videoIframe: {
    width: "100%",
    // Use aspect ratio to maintain video shape within flexible container
    aspectRatio: "9 / 16", // Common phone aspect ratio
    maxWidth: "100%", // Ensure it doesn't exceed panel content padding
    maxHeight: "calc(100% - 40px)", // Ensure it doesn't exceed panel content padding (approx)
    border: "none",
  },
  placeholderText: {
    color: "#adb5bd", // Lighter text color
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    alignSelf: "center", // Center vertically in flex container
  },
};

export default SubwaySliderPage;
