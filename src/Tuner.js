import React, { useEffect, useState } from "react";
import * as pitchfinder from "pitchfinder";
import { withRouter } from "react-router-dom";
import NoteCircle from "./NoteCircle";
import "./Tuner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faCheck } from "@fortawesome/free-solid-svg-icons";

const Tuner = (props) => {
  const redirectToHome = () => {
    props.history.push("/welcome");
  };
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState("");
  const [tuningStatus, setTuningStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const noteToFrequency = (note) => {
    const noteRegExp = /^([a-gA-G])([#b]?)(-?\d)$/;
    const match = noteRegExp.exec(note);
    if (!match) return null;

    const noteName = match[1].toUpperCase();
    const accidental = match[2];
    const octave = parseInt(match[3], 10);

    const noteIndex = "C C#D D#E F F#G G#A A#B".indexOf(noteName + accidental) / 2;
    const freq = 440 * Math.pow(2, (noteIndex - 9 + (octave - 4) * 12) / 12);
    return freq;
  };

  const frequencyToNote = (frequency) => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const semitoneIndex = Math.round(12 * (Math.log(frequency / 440) / Math.log(2)));
    const octave = Math.floor(semitoneIndex / 12) + 4;
    const noteIndex = (semitoneIndex + 120) % 12;

    return noteNames[noteIndex] + octave;
  };

  //Does not work with the audio library chosen, will choose random for demonstrative purposes
  const getTuningStatus = (detectedPitch, idealPitch) => {
    const tolerance = 0.5; // Tolerance in cents
    const difference = 1200 * Math.log(detectedPitch / idealPitch) / Math.log(2);

    if (Math.abs(difference) <= tolerance || Math.random() < 0.05) {
      return "Sharp";
    } else if (difference < 0 || Math.random() < 0.05) {
      return "Flat";
    } else {
      return "In-Tune";
    }
  };
  const randomTuningStatus = () => {
    const randomNumber = Math.random();
  
    if (randomNumber <= 1 / 3) {
      return "Sharp";
    } else if (randomNumber <= 2 / 3) {
      return "Flat";
    } else {
      return "In-Tune";
    }
  };

  const renderTuningStatus = () => {
    if (!tuningStatus) {
      return null;
    }
    switch (tuningStatus) {
      case "In-Tune":
        return <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />;
      case "Sharp":
        return <FontAwesomeIcon icon={faArrowUp} style={{ color: "red" }} />;
      case "Flat":
        return <FontAwesomeIcon icon={faArrowDown} style={{ color: "red" }} />;
      default:
        return null;
    }
  };
  

  useEffect(() => {
    const detectPitch = new pitchfinder.YIN();
    let audioContext;
    let analyser;
    let micStream;

    const startListening = async () => {
      try {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream = audioContext.createMediaStreamSource(stream);
        micStream.connect(analyser);

        const inputBuffer = new Float32Array(analyser.fftSize);
        updatePitch(inputBuffer);
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage("Error accessing the microphone. Please make sure to allow microphone access.");
      }
    };

    const updateTuningStatus = (detectedPitch, idealPitch) => {
      // Randomly choose between getTuningStatus and randomTuningStatus
      const randomFunction = Math.random() < 0.5 ? getTuningStatus : randomTuningStatus;
      
      // Set the tuning status using the chosen function
      if (randomFunction === getTuningStatus) {
        setTuningStatus(getTuningStatus(detectedPitch, idealPitch));
      } else {
        setTuningStatus(randomTuningStatus());
      }
    
      // Set a random interval between 1 and 5 seconds
      const randomInterval = Math.floor(Math.random() * 5000) + 5000;
    
      // Schedule the next tuning status update
      setTimeout(() => updateTuningStatus(detectedPitch, idealPitch), randomInterval);
    };
    
    const updatePitch = (inputBuffer) => {
      analyser.getFloatTimeDomainData(inputBuffer);
      const detectedPitch = detectPitch(inputBuffer, audioContext.sampleRate);
      if (detectedPitch) {
        const noteData = frequencyToNote(detectedPitch);
        const idealPitch = noteToFrequency(noteData);
        setPitch(detectedPitch);
        setNote(noteData);
      }
      requestAnimationFrame(() => updatePitch(inputBuffer));
    };
    
    startListening();
  
    return () => {
      if (micStream) {
        micStream.mediaStream.getTracks()[0].stop();
      }
    };
  }, []);
  
  useEffect(() => {
    let timeoutId;
  
    const updateTuningStatus = () => {
      const idealPitch = noteToFrequency(note);
  
      if (pitch) {
        setTuningStatus(getTuningStatus(pitch, idealPitch));
      }
  
      const randomInterval = Math.floor(Math.random() * 5000) + 5000;
      timeoutId = setTimeout(() => updateTuningStatus(), randomInterval);
    };
  
    if (pitch) {
      updateTuningStatus();
    }
  
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pitch, note]);
  

  return (
    <div className="container tuner-container">
      <h1 className="text-center">NoteFinder</h1>
      {pitch && <NoteCircle currentNote={note.replace(/\d+$/, "")} />}
      <div className="text-center tuning-status">{renderTuningStatus()}</div>
      {errorMessage && (
        <p className="text-center" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      <div className="text-center">
        <button className="btn btn-secondary" onClick={redirectToHome}>
          Back
        </button>
      </div>
    </div>
  );
};

export default withRouter(Tuner);
