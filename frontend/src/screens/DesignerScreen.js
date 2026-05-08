import React, { useState } from "react";

const designs = [
  { id: 1, src: "images/black tshirt.webp" },
  { id: 2, src: "images/printed.jpeg" },
  { id: 3, src: "images/red_t-shirt.jpg" },
];

export default function DesignerScreen() {
  const [selectedDesign, setSelectedDesign] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Design selection area */}
      <div style={{ display: "flex", gap: "10px" }}>
        {designs.map((design) => (
          <img
            key={design.id}
            src={design.src}
            alt={`Design ${design.id}`}
            style={{
              width: "100px",
              border: selectedDesign === design.id ? "3px solid blue" : "1px solid gray",
              cursor: "pointer",
            }}
            onClick={() => setSelectedDesign(design.id)}
          />
        ))}
      </div>

      {/* Base image with placeholder */}
      <div style={{ position: "relative", width: "400px", height: "300px" }}>
        <img
          src="images/white_tshirt.jpg"
          alt="Base"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Placeholder overlay */}
        {selectedDesign && (
          <img
            src={designs.find((d) => d.id === selectedDesign).src}
            alt="Selected Design"
            style={{
              position: "absolute",
              top: "100px",   // adjust placeholder position
              left: "120px",  // adjust placeholder position
              width: "150px", // adjust size
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
