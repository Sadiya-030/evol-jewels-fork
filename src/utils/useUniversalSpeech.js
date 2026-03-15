"use client";

import { useRef, useState } from "react";

export function useUniversalSpeech({
  onText,
  onAudioBlob,
  language = "en-IN",
}) {
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState(null); // "native" | "recording"

  const hasNativeSpeech =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  async function start() {
    if (isRecording) return;

    // ---------- PATH 1: Native Speech Recognition ----------
    if (hasNativeSpeech) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setMode("native");
      };

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        onText?.(text);
      };

      recognition.onerror = () => {
        stop();
      };

      recognition.onend = () => {
        stop();
      };

      recognitionRef.current = recognition;
      recognition.start();
      return;
    }

    // ---------- PATH 2: UNIVERSAL AUDIO RECORDING ----------
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        onAudioBlob?.(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setMode("recording");
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
      console.error(err);
    }
  }

  function stop() {
    if (!isRecording) return;

    if (mode === "native" && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mode === "recording" && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
    setMode(null);
  }

  return {
    start,
    stop,
    isRecording,
    hasNativeSpeech,
    mode,
  };
}
