import React, { useState, useEffect, useRef } from 'react';
import './EmotionTracker.css';

// This will be a placeholder for the actual face-api.js implementation
const EmotionTracker = ({ videoRef, isRecording, onEmotionUpdate }) => {
  const [emotions, setEmotions] = useState({
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0
  });
  
  const [dominantEmotion, setDominantEmotion] = useState('neutral');
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const emotionHistoryRef = useRef([]);
  const detectionIntervalRef = useRef(null);
  
  // Simulate loading face-api.js models - in a real app, you'd load actual models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Face detection models would be loaded here');
        // In a real implementation, you would load the face-api.js models:
        // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        // await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };
    
    loadModels();
  }, []);
  
  // Start/stop emotion detection based on recording state
  useEffect(() => {
    if (isRecording) {
      startEmotionDetection();
    } else {
      stopEmotionDetection();
    }
    
    return () => {
      stopEmotionDetection();
    };
  }, [isRecording]);
  
  const startEmotionDetection = () => {
    // Reset emotion history when starting a new recording
    emotionHistoryRef.current = [];
    
    // In a real implementation, this would process video frames using face-api.js
    // For this demo, we'll simulate random emotion detection
    detectionIntervalRef.current = setInterval(() => {
      // Generate random emotion values for demo purposes
      const newEmotions = {
        happy: Math.random(),
        neutral: Math.random() * 0.8,
        sad: Math.random() * 0.3,
        angry: Math.random() * 0.2,
        fearful: Math.random() * 0.2,
        disgusted: Math.random() * 0.1,
        surprised: Math.random() * 0.4
      };
      
      // Normalize values so they add up to 1
      const total = Object.values(newEmotions).reduce((sum, value) => sum + value, 0);
      const normalizedEmotions = {};
      
      for (const emotion in newEmotions) {
        normalizedEmotions[emotion] = newEmotions[emotion] / total;
      }
      
      setEmotions(normalizedEmotions);
      
      // Find dominant emotion
      let maxEmotion = 'neutral';
      let maxValue = 0;
      
      for (const emotion in normalizedEmotions) {
        if (normalizedEmotions[emotion] > maxValue) {
          maxValue = normalizedEmotions[emotion];
          maxEmotion = emotion;
        }
      }
      
      setDominantEmotion(maxEmotion);
      setConfidenceScore(Math.floor(maxValue * 100));
      
      // Save emotion data to history
      emotionHistoryRef.current.push({
        timestamp: Date.now(),
        emotions: normalizedEmotions,
        dominant: maxEmotion,
        confidence: maxValue
      });
      
      // Send update to parent component
      onEmotionUpdate({
        currentEmotions: normalizedEmotions,
        dominant: maxEmotion,
        confidence: maxValue,
        history: emotionHistoryRef.current
      });
      
    }, 1000); // Update every second
  };
  
  const stopEmotionDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };
  
  // Helper to get the highest emotion values for display
  const getTopEmotions = () => {
    return Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, value]) => ({
        emotion,
        percentage: Math.round(value * 100)
      }));
  };
  
  return (
    <div className="emotion-tracker">
      <div className="emotion-header">
        <h4>Emotion Analysis</h4>
        {isRecording ? (
          <span className="status-badge active">Active</span>
        ) : (
          <span className="status-badge inactive">Inactive</span>
        )}
      </div>
      
      <div className="dominant-emotion">
        <span className="emotion-label">Current Expression:</span>
        <span className={`emotion-value ${dominantEmotion}`}>
          {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
        </span>
        <span className="confidence">({confidenceScore}% confidence)</span>
      </div>
      
      <div className="emotion-bars">
        {getTopEmotions().map(({ emotion, percentage }) => (
          <div className="emotion-bar-container" key={emotion}>
            <div className="emotion-bar-label">
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </div>
            <div className="emotion-bar-wrapper">
              <div 
                className={`emotion-bar ${emotion}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="emotion-bar-value">{percentage}%</div>
          </div>
        ))}
      </div>
      
      {!isRecording && (
        <div className="emotion-message">
          <p>Emotion tracking will start when you begin recording.</p>
        </div>
      )}
    </div>
  );
};

export default EmotionTracker; 