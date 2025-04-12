import React, { useState, useRef, useEffect } from 'react';
import './VideoRecorder.css';

const VideoRecorder = ({ onRecordingComplete, onRecordingStart, onTranscriptUpdate, isRecording: parentIsRecording, setIsRecording: setParentIsRecording }) => {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        if (onRecordingComplete) {
          onRecordingComplete({
            url,
            blob,
            transcript: currentTranscript,
            duration: recordingTime
          });
        }
        
        // Reset transcript and time
        setCurrentTranscript('');
        setRecordingTime(0);
      };

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');
          setCurrentTranscript(transcript);
          if (onTranscriptUpdate) {
            onTranscriptUpdate(transcript);
          }
        };

        recognitionRef.current.start();
      }

      mediaRecorder.start(1000); // Collect data every second
      setParentIsRecording(true);
      if (onRecordingStart) {
        onRecordingStart(stream);
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing camera or microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping recognition
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setParentIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (parentIsRecording) {
        stopRecording();
      }
    };
  }, [parentIsRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-recorder">
      <div className="video-container">
        <video 
          ref={videoRef} 
          className="video-preview" 
          autoPlay 
          playsInline 
          muted={false} // Allow audio playback
        />
        
        {parentIsRecording && (
          <>
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              <span className="recording-time">{formatTime(recordingTime)}</span>
            </div>
            
            {currentTranscript && (
              <div className="captions-overlay">
                {currentTranscript}
              </div>
            )}
          </>
        )}
        
        <div className="controls">
          <button 
            className={`record-button ${parentIsRecording ? 'stop' : 'start'}`}
            onClick={parentIsRecording ? stopRecording : startRecording}
          >
            {parentIsRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder; 