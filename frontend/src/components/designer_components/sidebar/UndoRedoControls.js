import React from "react";

export default function UndoRedoControls({ canUndo, canRedo, onUndo, onRedo }) {
  return (
    <div className="undo-redo-controls">
      <button
        className="undo-redo-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl + Z)"
      >
        <i className="bi bi-arrow-counterclockwise"></i>
      </button>

      <button
        className="undo-redo-btn"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl + Y)"
      >
        <i className="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  );
}
