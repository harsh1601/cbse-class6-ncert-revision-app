"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultListItem = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionResultItem;
};

type SpeechRecognitionResultEvent = {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultListItem;
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition() {
  const speechWindow = window as Window &
    typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function SpeechToTextButton({ disabled = false, onTranscript }: { disabled?: boolean; onTranscript: (value: string) => void }) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startListening() {
    if (disabled || listening) {
      return;
    }

    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setMessage("Speech input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    setMessage("");
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index]?.[0]?.transcript ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      setMessage(event.error === "not-allowed" ? "Microphone permission is needed for speech input." : "Could not capture speech. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      recognitionRef.current = null;
      setMessage("Could not start speech input. Please try again.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={startListening}
        disabled={disabled || listening || !supported}
        aria-label={listening ? "Listening for answer" : "Speak answer"}
        title={listening ? "Listening for answer" : "Speak answer"}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold transition ${
          listening
            ? "border-coral bg-coral text-white"
            : "border-lagoon/30 bg-sky-50 text-lagoon hover:border-lagoon disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400"
        }`}
      >
        {listening ? <MicOff size={15} aria-hidden="true" /> : <Mic size={15} aria-hidden="true" />}
        {listening ? "Listening..." : "Speak answer"}
      </button>
      {message ? <span className="text-xs font-semibold text-coral">{message}</span> : null}
    </div>
  );
}
