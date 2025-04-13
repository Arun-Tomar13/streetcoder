import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar';
import GoalTracker from '../components/GoalTracker';
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
  UserCircleIcon,
  ChartBarIcon,
  FlagIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const CoachGoalTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('coach'); // 'coach' or 'goals'
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'bot',
      content: 'Hello! I\'m your AI Career Coach. How can I help you with your goals today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const chatContainerRef = useRef(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    priority: '',
    tags: []
  });
  const [goalCreationStep, setGoalCreationStep] = useState(0);

  // Coaching topics
  const coachingTopics = [
    { 
      id: 'goalSetting', 
      title: 'Goal Setting Strategy', 
      icon: FlagIcon,
      description: 'Learn effective goal setting techniques and execution strategies.'
    },
    { 
      id: 'interview', 
      title: 'Interview Preparation', 
      icon: VideoCameraIcon,
      description: 'Practice mock interviews for technical and behavioral questions.'
    },
    { 
      id: 'productivity', 
      title: 'Productivity Boost', 
      icon: BoltIcon,
      description: 'Get tips to improve focus, manage time better, and increase output.'
    },
    { 
      id: 'skills', 
      title: 'Skill Development', 
      icon: AcademicCapIcon,
      description: 'Personalized guidance to improve technical and soft skills.'
    }
  ];

  // Quick questions
  const quickQuestions = [
    "How do I break down my large goals into manageable tasks?",
    "Can you suggest a daily routine for productivity?",
    "What's a good system for tracking my progress?",
    "How do I stay motivated when facing obstacles?"
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

    // If we're in goal creation mode, process the input as part of that flow
    if (isCreatingGoal) {
      processGoalCreationStep(userInput);
    } else {
      // Regular message handling (existing code)
      setTimeout(() => {
        let response;
        
        // Generate response based on active goal
        if (activeGoalForCoaching) {
          response = generateGoalSpecificResponse(userInput, activeGoalForCoaching);
        } else {
          response = generateGenericResponse(userInput);
        }
        
        const botResponse = {
          sender: 'bot',
          content: response,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleQuickQuestion = (question) => {
    setUserInput(question);
    
    // Add user message to chat immediately
    const newUserMessage = {
      sender: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response;
      
      // Check if message is related to goals
      if (question.toLowerCase().includes('goal') || 
          question.toLowerCase().includes('track') ||
          question.toLowerCase().includes('progress')) {
        response = generateGoalResponse(question);
      } else {
        response = generateBotResponse(question);
      }
      
      const botResponse = {
        sender: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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

    // If goal setting was selected, start goal creation flow
    if (topic.id === 'goalSetting') {
      setTimeout(() => {
        // Start the goal creation conversation
        const botResponse = {
          sender: 'bot',
          content: `Let's create a new goal together. What's the main goal you want to achieve? Please provide a concise title.`,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        setIsCreatingGoal(true);
        setGoalCreationStep(1); // First step: title
      }, 1500);
    } 
    // For interview prep, also start goal creation but contextualized
    else if (topic.id === 'interview') {
      setTimeout(() => {
        // Start the interview prep goal creation
        const botResponse = {
          sender: 'bot',
          content: `Great choice! Let's create an interview preparation goal. What specific type of interview are you preparing for? (e.g., "Frontend Developer at Tech Company", "Data Science Position", etc.)`,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        setIsCreatingGoal(true);
        setGoalCreationStep(1); // First step: title
      }, 1500);
    }
    else {
      // Regular topic response (existing code)
      setTimeout(() => {
        const botResponse = {
          sender: 'bot',
          content: `Great choice! Let's work on ${topic.title}. ${topic.description} Where would you like to start?`,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  // Simple bot response generation for career coaching
  const generateBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('interview')) {
      return "For interview preparation, I recommend practicing behavioral questions using the STAR method and technical questions by explaining your thought process clearly. Would you like to work on a specific interview question?";
    } else if (lowerMsg.includes('routine') || lowerMsg.includes('productivity')) {
      return "A productive daily routine typically includes: 1) Planning the night before, 2) Starting with the most important task, 3) Taking regular breaks (e.g., Pomodoro technique), 4) Reflecting on accomplishments at day's end. Would you like to develop a personalized routine?";
    } else if (lowerMsg.includes('motivation') || lowerMsg.includes('stuck')) {
      return "When facing obstacles, try breaking the problem into smaller parts, remembering your 'why', celebrating small wins, and connecting with a community or mentor. What specific obstacle are you facing?";
    } else if (lowerMsg.includes('skill') || lowerMsg.includes('learn')) {
      return "Skills development requires deliberate practice. I recommend: 1) Set clear learning goals, 2) Break them into daily practice sessions, 3) Seek feedback, 4) Teach others what you learn. Which skill are you focusing on?";
    } else {
      return "I'm here to help with your career and personal development goals. You can ask me about goal setting, productivity, interview preparation, or skill development. What specific area would you like to explore?";
    }
  };
  
  // Goal-specific responses
  const generateGoalResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('break down') || lowerMsg.includes('manageable')) {
      return "Breaking down goals works best with the SMART framework: make each sub-task Specific, Measurable, Achievable, Relevant, and Time-bound. Start with the end goal, then work backward to identify milestone achievements. I recommend using our Goal Tracker feature - would you like me to open it for you?";
    } else if (lowerMsg.includes('track') || lowerMsg.includes('progress')) {
      return "Tracking progress is crucial for motivation. Try using: 1) Daily check-ins, 2) Weekly reviews, 3) Visual progress bars, 4) Streak counters. Our Goal Tracker has these features built-in. Would you like to set up tracking for a specific goal?";
    } else if (lowerMsg.includes('motivat') || lowerMsg.includes('obstacle')) {
      return "Staying motivated through obstacles requires both strategy and mindset. Try: connecting your goals to deeper values, using visual reminders, building accountability through sharing, and celebrating small wins. What specific obstacle are you facing?";
    } else {
      return "Effective goal setting involves clarity, commitment, and consistent tracking. I recommend setting both outcome goals (what you want to achieve) and process goals (daily actions). Would you like to use our Goal Tracker to set up a new goal now?";
    }
  };

  // New function to process goal creation steps
  const processGoalCreationStep = (userInput) => {
    // Process the current step
    switch (goalCreationStep) {
      case 1: // Title
        setNewGoalData(prev => ({ ...prev, title: userInput }));
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `"${userInput}" is a great goal! Now, please provide a brief description of what you want to achieve with this goal.`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setGoalCreationStep(2); // Next step: description
        }, 1500);
        break;
        
      case 2: // Description
        setNewGoalData(prev => ({ ...prev, description: userInput }));
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `Thanks for the description. Is this a short-term or long-term goal? (Please type "short-term" or "long-term")`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setGoalCreationStep(3); // Next step: category
        }, 1500);
        break;
        
      case 3: // Category
        setNewGoalData(prev => ({ ...prev, category: userInput.toLowerCase() }));
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `Got it. What's the priority level for this goal? (Please type "high", "medium", or "low")`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setGoalCreationStep(4); // Next step: priority
        }, 1500);
        break;
        
      case 4: // Priority
        setNewGoalData(prev => ({ ...prev, priority: userInput.toLowerCase() }));
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `What's your target deadline for achieving this goal? (Please use YYYY-MM-DD format or describe like "3 months from now")`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setGoalCreationStep(5); // Next step: deadline
        }, 1500);
        break;
        
      case 5: // Deadline
        setNewGoalData(prev => ({ ...prev, deadline: userInput }));
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `Almost done! Please provide some tags for your goal, separated by commas (e.g., "coding, career, learning")`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setGoalCreationStep(6); // Next step: tags
        }, 1500);
        break;
        
      case 6: // Tags
        const tags = userInput.split(',').map(tag => tag.trim());
        setNewGoalData(prev => ({ ...prev, tags: tags }));
        
        // Final step - goal creation summary and completion
        setTimeout(() => {
          const goal = {
            ...newGoalData,
            tags: tags,
            id: Date.now(),
            progress: 0,
            createdAt: new Date().toISOString()
          };
          
          // Here you would normally save the goal to your state or database
          // For demo, we'll just set it as the active goal for coaching
          
          const botResponse = {
            sender: 'bot',
            content: `Perfect! I've created your goal:
            
Title: ${goal.title}
Description: ${goal.description}
Category: ${goal.category}
Priority: ${goal.priority}
Deadline: ${goal.deadline}
Tags: ${goal.tags.join(', ')}

Your goal has been saved. Would you like me to help you break this down into actionable steps?`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setIsCreatingGoal(false);
          setGoalCreationStep(0);
          setActiveGoalForCoaching(goal);
        }, 1500);
        break;
        
      default:
        // Handle unexpected step
        setIsCreatingGoal(false);
        setGoalCreationStep(0);
        
        setTimeout(() => {
          const botResponse = {
            sender: 'bot',
            content: `I'm sorry, there was an issue with the goal creation process. Let's try again. What goal would you like to set?`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F7]">
        <div className="w-64 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-t-[#41A6B2] border-r-[#41A6B2] border-b-transparent border-l-transparent animate-spin"></div>
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
          <h1 className="text-xl font-semibold text-gray-800">AI Coach & Goal Tracker</h1>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('coach')}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                  activeTab === 'coach' 
                    ? 'bg-white text-[#41A6B2] shadow-sm' 
                    : 'text-gray-600 hover:text-[#41A6B2]'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Coach
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                  activeTab === 'goals' 
                    ? 'bg-white text-[#41A6B2] shadow-sm' 
                    : 'text-gray-600 hover:text-[#41A6B2]'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Goals
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'coach' ? (
          /* Coach Chat Interface */
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Area */}
            <div className="w-3/5 p-4 overflow-hidden flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-md flex-1 flex flex-col overflow-hidden"
              >
                {/* Chat Messages */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          msg.sender === 'user' 
                            ? 'bg-[#41A6B2] text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {msg.sender === 'bot' && <BoltIcon className="h-4 w-4 mr-1 text-[#41A6B2]" />}
                          <span className={`text-xs ${msg.sender === 'user' ? 'text-gray-100' : 'text-gray-500'}`}>
                            {msg.sender === 'user' ? 'You' : 'AI Coach'} • {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none max-w-[75%] px-4 py-3">
                        <div className="flex items-center mb-1">
                          <BoltIcon className="h-4 w-4 mr-1 text-[#41A6B2]" />
                          <span className="text-xs text-gray-500">AI Coach • Typing...</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent outline-none placeholder-gray-500 text-gray-800"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim()}
                      className={`ml-2 rounded-full p-2 ${userInput.trim() ? 'bg-[#41A6B2] text-white' : 'bg-gray-300 text-gray-500'}`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Sidebar with Topics */}
            <div className="w-2/5 p-4 overflow-hidden flex flex-col space-y-4">
              {/* Coaching Topics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Coaching Topics</h2>
                <div className="grid grid-cols-2 gap-3">
                  {coachingTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectTopic(topic)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedTopic?.id === topic.id 
                          ? 'border-[#41A6B2] bg-[#F5FBFC]' 
                          : 'border-gray-200 hover:border-[#41A6B2] hover:bg-[#F5FBFC]'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-[#E9F7F9] flex items-center justify-center">
                          <topic.icon className="h-6 w-6 text-[#41A6B2]" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">{topic.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{topic.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Quick Questions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Questions</h2>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="p-3 rounded-xl border border-gray-200 hover:border-[#41A6B2] hover:bg-[#F5FBFC] cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-gray-700">{question}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Goal Metrics Preview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Goal Progress</h2>
                  <button 
                    onClick={() => setActiveTab('goals')}
                    className="text-sm text-[#41A6B2] hover:underline"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Complete React Project</span>
                      <span className="text-xs font-medium text-[#41A6B2]">35%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#41A6B2] h-2 rounded-full" style={{width: "35%"}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Learn System Design</span>
                      <span className="text-xs font-medium text-[#41A6B2]">60%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#41A6B2] h-2 rounded-full" style={{width: "60%"}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Daily Reflection Streak</span>
                      <span className="text-xs font-medium text-[#41A6B2]">5 days</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div 
                          key={day} 
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            day <= 5 ? 'bg-[#41A6B2] text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Goal Tracker Interface */
          <div className="flex-1 p-4 overflow-y-auto">
            <GoalTracker />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachGoalTracker; 