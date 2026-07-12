import React from "react";

function MainTab({setActiveTab}) {
  return (
    <div className="start-tab">
      <h2 className="start-title">Bring Your Design to Life</h2>

      <button className="start-card" onClick={() => setActiveTab("addDesign")}>
        {/* <CollectionsIcon /> */}

        <div>
          <h3>Browse Designs</h3>
          <span>Choose from available designs</span>
        </div>
      </button>

      <button className="start-card" onClick={() => setActiveTab("uploadDesign")}>
        {/* <UploadIcon /> */}

        <div>
          <h3>Upload Design</h3>
          <span>Device or Google Drive</span>
        </div>
      </button>

      <button className="start-card" onClick={() => setActiveTab("addText")}>
        {/* <TextFieldsIcon /> */}

        <div>
          <h3>Add Text</h3>
          <span>Create custom text designs</span>
        </div>
      </button>

      <button className="start-card">
        {/* <TextFieldsIcon /> */}

        <div>
          <h3>Load Design</h3>
          <span>Load a design of yours</span>
        </div>
      </button>
    </div>
  );
}

export default MainTab;
