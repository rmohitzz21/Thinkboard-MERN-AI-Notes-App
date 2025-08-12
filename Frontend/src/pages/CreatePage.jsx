"use client";
import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  // Speech-to-Text setup
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.warn("Speech Recognition API not supported in this browser");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // for Indian English
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += text + " ";
        } else {
          interimTranscript += text;
        }
      }

      // Append only final results to saved text
      setContent((prev) => (finalTranscript ? prev + finalTranscript : prev));
    };
    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      toast.error("Voice recognition error");
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !content.trim()) {
      toast.error("Both title and content are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/notes", { title, content });
      toast.success("Note Created Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You are creating notes too fast.", {
          duration: 4000,
          icon: "⚠️",
        });
      } else {
        toast.error("Failed to create note.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back To Notes
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content + Voice Button */}
                <div className="form-control mb-4">
                  <label className="label flex justify-between items-center">
                    <span className="label-text">Content</span>
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`btn btn-xs flex items-center gap-1 ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-green-500 text-white"
                      }`}
                      title={
                        isListening ? "Stop Listening" : "Start Voice Input"
                      }
                    >
                      {isListening ? (
                        <MicOffIcon size={16} />
                      ) : (
                        <MicIcon size={16} />
                      )}
                      {isListening ? "Listening..." : "Speak"}
                    </button>
                  </label>
                  <textarea
                    placeholder="Write or speak your note..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Submit */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
