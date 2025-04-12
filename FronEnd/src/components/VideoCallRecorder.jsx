import React, { useState, useRef, useEffect } from 'react';
import './VideoCallRecorder.css';

const VideoCallRecorder = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loggedData, setLoggedData] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // In a real application, you would:
      // 1. Connect to a signaling server
      // 2. Establish WebRTC peer connection
      // 3. Handle remote stream
      // For demo purposes, we're just showing local video
      
      setIsInCall(true);
      
      // Automatically start recording when call starts
      startRecording(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing camera or microphone. Please check permissions.');
    }
  };

  const stopVideoCall = () => {
    // Stop recording first to save the audio data
    if (isRecording) {
      stopRecording();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsInCall(false);
  };

  const startRecording = (stream = null) => {
    const audioStream = stream || streamRef.current;
    if (!audioStream) return;

    try {
      // Create a new MediaRecorder from the audio track of the video call
      const audioTracks = audioStream.getAudioTracks();
      
      if (audioTracks.length === 0) {
        console.error('No audio tracks found in the stream');
        return;
      }
      
      const audioOnlyStream = new MediaStream([audioTracks[0]]);
      
      mediaRecorderRef.current = new MediaRecorder(audioOnlyStream);
      
      // Initialize speech recognition
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
        };

        recognitionRef.current.start();
      }
      
      chunksRef.current = []; // Clear any previous chunks
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        // Log the recording data
        const recordingData = {
          transcript: transcript,
          audioBlob: audioBlob,
          audioUrl: audioUrl,
          timestamp: new Date().toISOString(),
          duration: chunksRef.current.length > 0 ? 
            `Approximately ${Math.round(chunksRef.current.length / 10)} seconds` : 
            'Unknown'
        };
        
        console.log('Recording Data:', recordingData);
        setLoggedData(recordingData);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms for more frequent chunks
      setIsRecording(true);
      console.log('Recording started automatically with call');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error starting recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording and saving data...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = 'call-recording.wav';
      a.click();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (isRecording) {
        stopRecording();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="video-call-recorder">
      <div className="video-container">
        <div className="video-grid">
          <div className="video-wrapper local-video">
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
            />
            <div className="video-label">You</div>
            {isRecording && <div className="recording-indicator">Recording</div>}
          </div>
          <div className="video-wrapper remote-video">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
            />
            <div className="video-label">Remote User</div>
          </div>
        </div>
        
        <div className="call-controls">
          <button 
            className={`call-button ${isInCall ? 'end-call' : 'start-call'}`}
            onClick={isInCall ? stopVideoCall : startVideoCall}
          >
            {isInCall ? 'End Call' : 'Start Call'}
          </button>
          
          {isInCall && (
            <div className="recording-status">
              Recording automatically started with call
            </div>
          )}
        </div>
      </div>

      {audioURL && (
        <div className="recording-playback">
          <h3>Call Recording</h3>
          <audio src={audioURL} controls />
          <button className="download-button" onClick={handleDownload}>
            Download Recording
          </button>
        </div>
      )}

      {transcript && (
        <div className="transcript-container">
          <h4>Call Transcript:</h4>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}
      
      {loggedData && (
        <div className="logged-data">
          <h4>Logged Recording Data:</h4>
          <div className="data-container">
            <p><strong>Timestamp:</strong> {loggedData.timestamp}</p>
            <p><strong>Duration:</strong> {loggedData.duration}</p>
            <p><strong>Transcript Sample:</strong> {loggedData.transcript.substring(0, 100)}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallRecorder; 