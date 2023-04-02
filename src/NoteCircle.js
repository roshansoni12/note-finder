import React from "react";
import "./NoteCircle.css";

const NoteCircle = ({ currentNote }) => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const radius = 160;
  const centerX = 160;
  const centerY = 160;

  const calculateNotePosition = (index, totalNotes) => {
    const angle = (index / totalNotes) * Math.PI * 2;
    const x = centerX + radius * Math.cos(angle) - 15;
    const y = centerY + radius * Math.sin(angle) - 10;
    return { x, y, angle };
  };

  return (
    <div className="note-circle">
      {noteNames.map((note, index) => {
        const { x, y, angle } = calculateNotePosition(index, noteNames.length);
        return (
          <div
            key={note}
            className={`note ${note === currentNote ? "current-note" : ""}`}
            style={{
              left: x,
              top: y,
              transform: `rotate(${angle}rad)`,
            }}
          >
            {note}
          </div>
        );
      })}
    </div>
  );
};

export default NoteCircle;
