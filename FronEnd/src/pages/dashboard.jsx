import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Sphere, 
  Box, 
  Torus 
} from '@react-three/drei';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon, 
  BellIcon, 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentArrowUpIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import themes from '../theme';

// Basic 3D objects instead of model files
const LightbulbModel = () => {
  const bulb = useMemo(() => {
    return (
      <group>
        <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#FFD700" emissive="#FFFFE0" emissiveIntensity={0.5} />
        </Sphere>
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </group>
    );
  }, []);
  
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 3;
    state.camera.position.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 3;
    state.camera.lookAt(0, 0, 0);
  });
  
  return bulb;
};

const CalendarModel = () => {
  const calendar = useMemo(() => {
    return (
      <group>
        <Box args={[2, 2.5, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Box>
        {/* Calendar grid lines */}
        {[-0.7, -0.2, 0.3, 0.8].map((y, i) => (
          <Box key={i} args={[1.8, 0.05, 0.05]} position={[0, y, 0.1]}>
            <meshStandardMaterial color="#DDDDDD" />
          </Box>
        ))}
        {[-0.7, -0.2, 0.3].map((x, i) => (
          <Box key={i} args={[0.05, 2.3, 0.05]} position={[x, 0, 0.1]}>
            <meshStandardMaterial color="#DDDDDD" />
          </Box>
        ))}
        {/* Highlight today */}
        <Box args={[0.4, 0.4, 0.05]} position={[-0.45, 0.55, 0.15]}>
          <meshStandardMaterial color="#FF375F" />
        </Box>
      </group>
    );
  }, []);
  
  useFrame((state) => {
    state.camera.position.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3;
  });
  
  return calendar;
};

const RobotModel = () => {
  const robot = useMemo(() => {
    return (
      <group>
        {/* Head */}
        <Box args={[1, 1, 1]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Eyes */}
        <Sphere args={[0.15, 16, 16]} position={[-0.3, 1.6, 0.5]}>
          <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[0.3, 1.6, 0.5]}>
          <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} />
        </Sphere>
        {/* Body */}
        <Box args={[1.5, 2, 0.8]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.5} />
        </Box>
        {/* Arms */}
        <Box args={[0.4, 1.8, 0.4]} position={[-1.1, 0, 0]}>
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </Box>
        <Box args={[0.4, 1.8, 0.4]} position={[1.1, 0, 0]}>
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </Box>
      </group>
    );
  }, []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.scene.rotation.y = Math.sin(t * 0.3) * 0.2;
  });
  
  return robot;
};

// Sidebar Component with Steve Jobs aesthetic
const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname.split('/')[1];
    return path || 'QuickConnect';
  });

  const menuItems = [
    { title: 'QuickConnect', icon: HomeIcon, notification: 0, path: '/' },
    { title: 'PathFinder', icon: ChartBarIcon, notification: 0, path: '/pathfinder' },
    { title: 'ResumeCraft', icon: AcademicCapIcon, notification: 2, path: '/resumecraft' },
    { title: 'SpeakSmart', icon: LightBulbIcon, notification: 0, path: '/speaksmart' },
    { title: 'Skillpuls', icon: UserGroupIcon, notification: 3, path: '/skillpuls' },
    { title: 'CoachBot', icon: DocumentTextIcon, notification: 0, path: '/coachbot' },
    { title: 'Growth', icon: BellIcon, notification: 5, path: '/growth' },
    { title: 'Settings', icon: CogIcon, notification: 0, path: '/settings' },
    { title: 'Help', icon: QuestionMarkCircleIcon, notification: 0, path: '/help' },
  ];

  return (
    <div className="w-20 h-screen bg-white fixed top-0 left-0 z-50 shadow-sm border-r border-gray-100">
      {/* Logo */}
      <Link to="/" className="block">
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <LightBulbIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </Link>

      {/* Profile */}
      <div className="flex flex-col p-3 items-center border-b border-gray-100">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F7] border border-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-800">AJ</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <motion.div key={item.title} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link 
              to={item.path}
              onClick={() => setActiveItem(item.title)}
              className={`flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all duration-200 relative group`}
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                activeItem === item.title 
                  ? 'bg-black text-white' 
                  : 'border border-gray-200 bg-[#F5F5F7] text-gray-700'
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              
              {/* Tooltip that appears on hover */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {item.title}
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-black border-b-transparent"></div>
              </div>
              
              {item.notification > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium">
                    {item.notification}
                  </span>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Pro Access Button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <motion.div className="flex justify-center relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Link to="/pricing" className="block">
            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-[#F5F5F7] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </Link>
          
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Get Pro Access
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-black border-b-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // Career progress stats
  const stats = [
    { title: 'Skills Mastered', value: '24', change: '+3', isPositive: true, icon: AcademicCapIcon },
    { title: 'Interview Score', value: '87%', change: '+12%', isPositive: true, icon: LightBulbIcon },
    { title: 'Resume Strength', value: '92%', change: '+8%', isPositive: true, icon: DocumentTextIcon },
    { title: 'Career Readiness', value: '78%', change: '+5%', isPositive: true, icon: ChartBarIcon },
  ];

  // Career paths
  const careerPaths = [
    { title: 'Software Engineering', progress: 65, skills: 38, estimate: '8 months', color: '#0071E3' },
    { title: 'Product Management', progress: 42, skills: 24, estimate: '11 months', color: '#9858F5' },
    { title: 'Data Science', progress: 28, skills: 19, estimate: '14 months', color: '#FF375F' }
  ];

  // Upcoming events
  const upcomingEvents = [
    { title: 'Mock Interview: Frontend Development', time: 'Tomorrow, 3:00 PM', type: 'Interview' },
    { title: 'Group Discussion: Career Transitions', time: 'Friday, 5:30 PM', type: 'Community' },
    { title: 'Resume Review Session', time: 'Next Monday, 2:00 PM', type: 'Review' },
  ];

  useEffect(() => {
    // Shorter loading time since we're not loading external models
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F7]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-black border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 overflow-auto">
        {/* Top Navigation */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Elevate OS</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your CoachBot..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black w-64"
              />
              <MicrophoneIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer">
                <BellIcon className="h-5 w-5 text-white" />
            </div>
            </motion.div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6">
          {/* Welcome Section with 3D Model */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Alex</h2>
            <p className="text-gray-600">Your career growth is on track. Here's what you can focus on today.</p>
          </div>
            <div className="w-48 h-48">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls enableZoom={false} enablePan={false} />
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                  <LightbulbModel />
                </Float>
                <Environment preset="city" />
              </Canvas>
            </div>
          </motion.div>
          
          {/* Daily Insight Card with black text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl shadow-md p-6 mb-8 text-black relative overflow-hidden"
            style={{ background: themes.gradients.pageBackground }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Subtle animated background effect similar to login page */}
            <motion.div 
              className="absolute rounded-full" 
              style={{ 
                width: '250px', 
                height: '250px', 
                top: '-50%', 
                right: '-10%', 
                border: '1px solid rgba(0,0,0,0.05)',
                filter: 'blur(0.5px)',
                pointerEvents: 'none'
              }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="flex items-start relative z-10">
              <div className="p-3 bg-black bg-opacity-10 rounded-lg mr-4">
                <LightBulbIcon className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Today's Focus</h3>
                <p className="opacity-90 mb-4">Based on your recent practice, focus on improving your technical explanation skills. I've prepared a personalized exercise for you.</p>
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-black text-white rounded-lg font-medium text-sm"
                  >
                    Start Exercise
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-transparent border border-black text-black rounded-lg font-medium text-sm"
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F5F5F7]">
                    <stat.icon className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">this month</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Career Paths with 3D Elements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Your Career Paths</h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.98 }}
                  className="p-2 rounded-lg hover:bg-[#F5F5F7] text-black text-sm font-medium"
                >
                  Explore More Paths
                </motion.button>
              </div>
              
              <div className="space-y-6">
                {careerPaths.map((path, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="border border-gray-100 rounded-lg p-4 hover:border-black transition-colors bg-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{path.title}</h4>
                      <span className="text-sm text-gray-500">Est. {path.estimate} to job-ready</span>
                    </div>
                    
                    <div className="w-full bg-[#F5F5F7] rounded-full h-2.5 mb-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
                        className="h-2.5 rounded-full" 
                        style={{ backgroundColor: path.color }}
                      ></motion.div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-medium" style={{ color: path.color }}>{path.progress}% complete</span>
                      <span className="text-gray-600">{path.skills} skills identified</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Upcoming Events with 3D Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.98 }}
                  className="text-black text-sm hover:underline"
                >
                  Schedule More
                </motion.button>
              </div>
              
              {/* 3D Calendar Visual */}
              <div className="h-40 mb-4">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                    <CalendarModel />
                  </Float>
                  <Environment preset="city" />
                </Canvas>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="p-2 rounded-lg mr-3 bg-[#F5F5F7]">
                      {event.type === 'Interview' ? (
                        <UserGroupIcon className="h-5 w-5 text-black" />
                        ) : event.type === 'Community' ? (
                        <BellIcon className="h-5 w-5 text-black" />
                        ) : (
                        <DocumentTextIcon className="h-5 w-5 text-black" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                  </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
          
          {/* AI Coach Interaction Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8"
          >
            <div className="flex items-center space-x-8">
              <div className="w-1/3 h-64">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <RobotModel />
                  </Float>
                  <Environment preset="city" />
                </Canvas>
              </div>
              
              <div className="w-2/3">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Your AI Career Coach</h3>
                <p className="text-gray-600 mb-4">
                  Ready to accelerate your career growth? Your personal AI coach can help you practice interviews, improve your skills, and navigate your career path.
                </p>
                <div className="space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 text-black rounded-xl font-medium text-sm flex items-center justify-center relative overflow-hidden"
                    style={{ background: themes.gradients.pageBackground }}
                  >
                    <MicrophoneIcon className="h-5 w-5 mr-2" />
                    Start Practice Session
                  </motion.button>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      className="py-2 border border-gray-300 rounded-xl text-gray-800 font-medium text-sm"
                    >
                      View Progress
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      className="py-2 border border-gray-300 rounded-xl text-gray-800 font-medium text-sm"
                    >
                      Customize Coach
                    </motion.button>
                  </div>
                </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;