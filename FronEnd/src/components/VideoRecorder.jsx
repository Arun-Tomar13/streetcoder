import React, { useState, useRef, useEffect } from 'react';
import './VideoRecorder.css';

const VideoRecorder = ({ 
  onRecordingStart, 
  onRecordingStop,
  onTranscriptUpdate,
  isQuestionActive 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  
  // Initialize webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing webcam or microphone:', error);
      }
    };
    
    setupWebcam();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setTranscript(currentTranscript);
        onTranscriptUpdate(currentTranscript);
      };
    }
  }, [onTranscriptUpdate]);
  
  const startRecording = () => {
    if (!stream) return;
    
    // Reset recording state
    audioChunksRef.current = [];
    setRecordingTime(0);
    setTranscript('');
    
    // Start media recorder
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Send recording data to parent component
      onRecordingStop({
        audio: {
          blob: audioBlob,
          url: audioUrl
        },
        transcript,
        duration: recordingTime
      });
    };
    
    // Start speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prevTime => {
        const newTime = prevTime + 1;
        // Auto-stop recording after 2 minutes (120 seconds)
        if (newTime >= 120) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
    onRecordingStart();
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop media recorder
      mediaRecorderRef.current.stop();
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsRecording(false);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Recognition may not be started, ignore
        }
      }
    };
  }, []);
  
  return (
    <div className="video-recorder">
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="video-preview"
        />
        
        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot"></span>
            <span className="recording-time">
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
      
      <div className="transcript-container">
        <h4>Live Transcript</h4>
        <div className="transcript-content">
          {transcript ? transcript : 'Transcript will appear here as you speak...'}
        </div>
      </div>
      
      <div className="controls">
        <button 
          className={`record-button ${isRecording ? 'stop' : 'start'}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isQuestionActive}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {!isQuestionActive && (
          <p className="controls-message">
            Please select a question before recording your answer.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder; 