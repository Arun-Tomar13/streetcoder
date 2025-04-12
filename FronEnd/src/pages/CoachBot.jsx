import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar';
import { 
  AcademicCapIcon, 
  MicrophoneIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  VideoCameraIcon,
  ArrowUpIcon,
  BoltIcon,
  PaperAirplaneIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const CoachBot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'bot',
      content: 'Hello! I\'m your AI Career Coach. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Coaching topics
  const coachingTopics = [
    { 
      id: 'interview', 
      title: 'Interview Preparation', 
      icon: VideoCameraIcon,
      description: 'Practice mock interviews for technical and behavioral questions.'
    },
    { 
      id: 'resume', 
      title: 'Resume Review', 
      icon: DocumentTextIcon,
      description: 'Get feedback on your resume and suggestions for improvement.'
    },
    { 
      id: 'skills', 
      title: 'Skill Development', 
      icon: AcademicCapIcon,
      description: 'Personalized guidance to improve technical and soft skills.'
    },
    { 
      id: 'negotiation', 
      title: 'Salary Negotiation', 
      icon: ChatBubbleLeftRightIcon,
      description: 'Learn strategies for negotiating job offers and compensation.'
    }
  ];

  // Quick questions
  const quickQuestions = [
    "How do I prepare for a system design interview?",
    "What's a good answer to 'Tell me about yourself'?",
    "How can I improve my technical communication?",
    "What skills should I focus on next?"
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const newUserMessage = {
      sender: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        content: generateBotResponse(userInput),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setUserInput(question);
    handleSendMessage();
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    
    // Add a message about selected topic
    const newUserMessage = {
      sender: 'user',
      content: `I'd like to work on ${topic.title}`,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    setIsTyping(true);

    // Simulate AI response for topic selection
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        content: `Great choice! Let's work on ${topic.title}. ${topic.description} Where would you like to start?`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple bot response generation (would be replaced with actual AI integration)
  const generateBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('interview')) {
      return "For interview preparation, I recommend practicing behavioral questions using the STAR method and technical questions by explaining your thought process clearly. Would you like to start a mock interview session?";
    } else if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
      return "I can help review your resume. For tech roles, focus on quantifiable achievements, technologies used, and problem-solving examples. Would you like specific resume feedback?";
    } else if (lowerMsg.includes('negotiation') || lowerMsg.includes('salary')) {
      return "For salary negotiations, research industry standards, prepare your value proposition, and practice your delivery. What specific stage of negotiation are you in?";
    } else if (lowerMsg.includes('skill') || lowerMsg.includes('learn')) {
      return "Skills development is important. Based on current trends, I recommend focusing on system design, coding patterns, and communication skills. Which area interests you most?";
    } else {
      return "I'm here to help with your career development. You can ask me about interview preparation, resume review, skill development, or salary negotiation. What specific area are you focusing on?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F7]">
        <div className="w-64 flex flex-col items-center">
          <div className="w-48 h-48 flex items-center justify-center">
           
          </div>
          <p className="text-center mt-4 text-gray-600 font-medium">Loading your coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 overflow-hidden flex flex-col">
        {/* Top Navigation */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">AI Career Coach</h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center"
            >
              <MicrophoneIcon className="h-4 w-4 mr-2" />
              Voice Mode
            </motion.button>
          </div>
        </div>
        
        {/* Main Dashboard Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="w-3/5 p-4 overflow-hidden flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md flex-1 flex flex-col overflow-hidden"
            >
              {/* Chat messages area */}
              <div className="flex-1 overflow-y-auto p-6">
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-3">
                        <BoltIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center ml-3">
                        <UserCircleIcon className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex mb-4 justify-start">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-3">
                      <BoltIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 text-gray-800 rounded-lg p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat input area */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ask your career coach a question..."
                    className="flex-1 px-4 py-2 rounded-l-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
                    onClick={handleSendMessage}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Quick questions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Panel */}
          <div className="w-2/5 p-4 overflow-auto">
            {/* Coach visualization - replaced with static image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden mb-4 h-[250px] flex items-center justify-center"
            >
              <img 
                src="https://i.imgur.com/LtPoXzc.png" 
                alt="AI Coach Bot" 
                className="object-contain h-[200px]" 
              />
            </motion.div>
            
            {/* Coaching Topics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden mb-4"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Coaching Topics
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {coachingTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-xl cursor-pointer ${
                      selectedTopic?.id === topic.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => selectTopic(topic)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        selectedTopic?.id === topic.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-blue-500'
                      }`}>
                        <topic.icon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">{topic.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Session Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Your Coaching Stats
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Total Sessions</div>
                    <div className="text-2xl font-semibold text-gray-800">12</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Last Session</div>
                    <div className="text-2xl font-semibold text-gray-800">2 days ago</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Interview Readiness</div>
                    <div className="text-2xl font-semibold text-gray-800">85%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Skill Progress</div>
                    <div className="text-2xl font-semibold text-gray-800">+12%</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Improvements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Technical Communication</span>
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Problem Solving</span>
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">8%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">System Design</span>
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
                  >
                    View Detailed Progress
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachBot; 