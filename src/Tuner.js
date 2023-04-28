import React, { useEffect, useState, useRef } from "react";
import * as pitchfinder from "pitchfinder";
import { withRouter } from "react-router-dom";
import NoteCircle from "./NoteCircle";
import "./Tuner.css";

const Tuner = (props) => {
  const redirectToHome = () => {
    props.history.push("/welcome");
  };
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [metronomeBpm, setMetronomeBpm] = useState(60);
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const metronomeRef = useRef(null);

  const frequencyToNote = (frequency) => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const semitoneIndex = Math.round(12 * (Math.log(frequency / 480) / Math.log(2)));
    const octave = Math.floor(semitoneIndex / 12) + 4;
    const noteIndex = (semitoneIndex + 120) % 12;

    return noteNames[noteIndex] + octave;
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
        setErrorMessage("Error accessing the microphone. Please make sure to allow microphone access.");
      }
    };

    const updatePitch = (inputBuffer) => {
      analyser.getFloatTimeDomainData(inputBuffer);
      const detectedPitch = detectPitch(inputBuffer, audioContext.sampleRate);
      if (detectedPitch) {
        setPitch(detectedPitch);
        setNote(frequencyToNote(detectedPitch));
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

  const playTone = (frequency, duration) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.frequency.value = frequency;
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleMetronomeStartStop = () => {
    if (metronomePlaying) {
      clearInterval(metronomeRef.current);
      setMetronomePlaying(false);
    } else {
      setMetronomePlaying(true);
      metronomeRef.current = setInterval(() => {
        playTone(1000, 0.1); // Play a 1000 Hz tone for 100 ms
      }, 60000 / metronomeBpm);
    }
  };

  const handleMetronomeSlider = (e) => {
    setMetronomeBpm(e.target.value);
    if (metronomePlaying) {
      clearInterval(metronomeRef.current);
      metronomeRef.current = setInterval(() => {
        playTone(1000, 0.1); // Play a 1000 Hz tone for 100 ms
      }, 60000 / metronomeBpm);
    }
  };

  return (
    <div className="container tuner-container">
      <h1 className="text-center">NoteFinder</h1>
      {pitch && <NoteCircle currentNote={note.replace(/\d+$/, "")} />}
      {errorMessage && (
        <p className="text-center" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      <div className="metronome">
        <h3>Metronome</h3>
        <div className="controls">
          <button className="btn btn-primary" onClick={handleMetronomeStartStop}>
            {metronomePlaying ? "Stop" : "Start"}
          </button>
          <input
            type="range"
            min="40"
            max="240"
            value={metronomeBpm}
            onChange={handleMetronomeSlider}
          />
          <p>BPM: {metronomeBpm}</p>
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-secondary" onClick={redirectToHome}>
          Back
        </button>
      </div>
    </div>
  );
};

export default withRouter(Tuner);