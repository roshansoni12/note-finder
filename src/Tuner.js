import React, { useEffect, useState } from "react";
import * as pitchfinder from "pitchfinder";

const Tuner = () => {
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const frequencyToNote = (frequency) => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const semitoneIndex = Math.round(12 * (Math.log(frequency / 440) / Math.log(2)));
    const octave = Math.floor(semitoneIndex / 12) + 4;
    const noteIndex = (semitoneIndex + 120) % 12;

    return noteNames[noteIndex] + octave;
  };

  useEffect(() => {
    if (isMounted) {
      return;
    }
    setIsMounted(true);

    let audioContext;
    let analyser;
    let micStream;
    const detectPitch = new pitchfinder.YIN();

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

    const stopListening = () => {
      if (micStream) {
        micStream.mediaStream.getTracks()[0].stop();
      }
    };

    const updatePitch = (inputBuffer) => {
      analyser.getFloatTimeDomainData(inputBuffer);
      const detectedPitch = detectPitch(inputBuffer, audioContext.sampleRate);
      if (detectedPitch) {
        console.log("Detected pitch:", detectedPitch); // Add this line for debugging
        setPitch(detectedPitch);
        setNote(frequencyToNote(detectedPitch));
      }
      requestAnimationFrame(() => updatePitch(inputBuffer));
    };

    startListening();

    return () => stopListening();
  }, [isMounted]);

  return (
    <div>
      <h1>Music Tuner</h1>
      {pitch && (
        <div>
          <p>Detected pitch: {pitch.toFixed(2)} Hz</p>
          <p>Detected note: {note}</p>
        </div>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Tuner;
