import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Sphere } from '@react-three/drei';
import { FaGithub, FaLinkedin, FaChartLine, FaRocket, FaUserAstronaut, FaCode, 
         FaBriefcase, FaUsers, FaStar, FaCog, FaBell, FaVolumeUp, FaVolumeMute, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Animated background component with Three.js
const AnimatedBackground = () => {
  const meshRef = useRef();
  const particlesRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#6366f1" />
      <Stars ref={particlesRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <torusKnotGeometry args={[9, 2.5, 256, 32, 2, 3]} />
        <meshStandardMaterial color="#6366f1" wireframe={true} />
      </mesh>
    </>
  );
};

// Floating object component
const FloatingObject = ({ position, size, color, speed }) => {
  const mesh = useRef();
  const objectColor = color || "#6366f1";
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005;
      mesh.current.rotation.x += 0.005 * speed;
      mesh.current.rotation.y += 0.005 * speed;
    }
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={objectColor} wireframe={true} />
    </mesh>
  );
};

// 3D text component with error handling
const AnimatedText3D = ({ text, position, size = 1 }) => {
  const meshRef = useRef();
  const [fontLoaded, setFontLoaded] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  // Always use fallback since we're removing font loading
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size * 5, size, size * 0.2]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
};

// User data object that contains all site content
const userData = {
  profile: {
    name: "Dhrupesh Brahmbhatt",
    email: "dhrupeshbrahmbhatt@gmail.com",
    role: "Full Stack Developer",
    bio: "Passionate developer with expertise in React, Node.js and cloud technologies. Building innovative solutions to real-world problems.",
    avatar: "https://xsgames.co/randomusers/assets/avatars/male/42.jpg",
    githubUrl: "https://github.com/dhrupeshbrahmbhatt",
    linkedinUrl: "https://www.linkedin.com/in/dhrupesh-brahmbhatt-a45656237/"
  },
  
  github: {
    repos: 18,
    stars: 47,
    followers: 26,
    contributions: 873,
    topRepos: [
      { name: "AI-Parking-Detection", stars: 22, language: "Python" },
      { name: "VisionX-Dashboard", stars: 15, language: "React" },
      { name: "ElevateOS-App", stars: 10, language: "React Native" }
    ]
  },
  
  linkedin: {
    connections: 342,
    endorsements: 38,
    recommendations: 12,
    recentActivity: "Presented innovative full-stack solutions at TechConnect 2023 developer conference"
  },
  
  projects: {
    completed: 15,
    inProgress: 5,
    upcoming: 8,
    teamMembers: 9,
    nextMilestone: "VisionX Beta Launch",
    daysToMilestone: 7,
    featuredProjects: [
      {
        name: "Autonomous Parking System",
        description: "AI-powered computer vision solution for smart parking management",
        technologies: ["Python", "TensorFlow", "OpenCV", "React"],
        thumbnail: "https://images.unsplash.com/photo-1621415814107-28209d4b82fe?q=80&w=1000"
      },
      {
        name: "Think-Tech Dashboard",
        description: "Interactive data visualization platform with real-time analytics",
        technologies: ["React", "D3.js", "Node.js", "MongoDB"],
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
      },
      {
        name: "NikeStore App",
        description: "Mobile e-commerce platform with AR try-on capabilities",
        technologies: ["React Native", "Firebase", "AR Kit", "Stripe"],
        thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"
      }
    ]
  },
  
  skills: [
    { name: "React", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "JavaScript", level: 92 },
    { name: "Python", level: 85 },
    { name: "Three.js", level: 80 },
    { name: "MongoDB", level: 88 },
    { name: "AWS", level: 82 },
    { name: "Docker", level: 78 }
  ],
  
  analytics: {
    summary: "Exceptional growth trajectory in Q2 2023",
    growth: "78%",
    efficiency: "92%",
    innovation: "96%",
    trends: [65, 72, 78, 82, 88, 92, 96]
  },
  
  timeline: [
    {
      year: 2023,
      title: "Lead Developer at TechFlow",
      description: "Leading a team of 6 developers building next-gen smart city solutions"
    },
    {
      year: 2022,
      title: "Senior Developer at InnovateCorp",
      description: "Developed AI-powered analytics platform increasing client efficiency by 32%"
    },
    {
      year: 2021,
      title: "Full Stack Developer at QuantumEdge",
      description: "Built scalable microservices architecture handling 2M+ daily requests"
    },
    {
      year: 2020,
      title: "Junior Developer at StartupX",
      description: "Created responsive web applications and mobile-first experiences"
    }
  ],
  
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "CTO, TechFlow",
      image: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
      text: "Dhrupesh consistently delivers innovative solutions that exceed expectations. His technical expertise and creative problem-solving have been invaluable."
    },
    {
      name: "Michael Chen",
      role: "Product Manager, InnovateCorp",
      image: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
      text: "Working with Dhrupesh has transformed our development process. His attention to detail and forward-thinking approach have accelerated our product roadmap."
    }
  ]
};

// Main component
export default function DeveloperSite() {
  const { type } = useParams();
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  
  const [editableContent, setEditableContent] = useState(() => {
    const savedContent = localStorage.getItem('editableContent');
    if (savedContent) {
      return JSON.parse(savedContent);
    } else {
      const initialContent = { ...userData };
      
      initialContent.siteName = "Elevate";
      initialContent.siteNameAccent = "OS";
      initialContent.hero = {
        line1: "Innovate.",
        line2: "Create.",
        line3: "Transform.",
        description: "Pushing the boundaries of what's possible through cutting-edge development and innovative solutions.",
        button1: "View Projects",
        button2: "Contact Me"
      };
      initialContent.featured = {
        title: "Featured Projects"
      };
      initialContent.footer = {
        brand: "ElevateOS",
        tagline: " Innovating for tomorrow."
      };
      
      return initialContent;
    }
  });
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [1, 1, 0.2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [1, 0.9, 0.8, 0.7]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);


  // Save to localStorage whenever editableContent changes
  useEffect(() => {
    // This ensures real-time persistence of changes
    localStorage.setItem('editableContent', JSON.stringify(editableContent));
  }, [editableContent]);
  
  const handleNavClick = (section) => {
    if (section === 'portfolio') {
      navigate('/dashboard');
    } else {
      setActiveSection(section);
    }
  };

  // Handle text edit with real-time update
  const handleTextEdit = (path, value) => {
    if (!editMode) return;
    
    // Create a deep copy of the current state
    const newContent = JSON.parse(JSON.stringify(editableContent));
    
    // Handle paths like "profile.name" or "projects.featuredProjects[0].name"
    const pathParts = path.split('.');
    let current = newContent;
    
    // Navigate to and create the path if needed
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      
      // Handle array access like "featuredProjects[0]"
      if (part.includes('[')) {
        const name = part.substring(0, part.indexOf('['));
        const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
        
        if (!current[name]) current[name] = [];
        if (!current[name][index]) current[name][index] = {};
        
        current = current[name][index];
      } else {
        // Handle regular object property
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
    
    // Set the value at the final path part
    const lastPart = pathParts[pathParts.length - 1];
    
    // Handle array access in the last part too
    if (lastPart.includes('[')) {
      const name = lastPart.substring(0, lastPart.indexOf('['));
      const index = parseInt(lastPart.substring(lastPart.indexOf('[') + 1, lastPart.indexOf(']')));
      
      if (!current[name]) current[name] = [];
      current[name][index] = value;
    } else {
      current[lastPart] = value;
    }
    
    // Update the state which will trigger localStorage save via useEffect
    setEditableContent(newContent);
    
    // Log for debugging
    console.log(`Updated ${path} to:`, value);
  };

  // Reset to default content
  const handleResetContent = () => {
    if (window.confirm('Are you sure you want to reset all content to default?')) {
      localStorage.removeItem('editableContent');
      
      // Initialize with userData and add any missing properties needed by EditableText components
      const initialContent = { ...userData };
      
      // Add properties that are used in EditableText but not in userData
      initialContent.siteName = "Elevate";
      initialContent.siteNameAccent = "OS";
      initialContent.hero = {
        line1: "Innovate.",
        line2: "Create.",
        line3: "Transform.",
        description: "Pushing the boundaries of what's possible through cutting-edge development and innovative solutions.",
        button1: "View Projects",
        button2: "Contact Me"
      };
      initialContent.featured = {
        title: "Featured Projects"
      };
      initialContent.footer = {
        brand: "ElevateOS",
        tagline: " Innovating for tomorrow."
      };
      
      setEditableContent(initialContent);
    }
  };

  // Editable text component
  const EditableText = ({ path, content, className }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState('');
    const inputRef = useRef(null);
    
    // Get the actual value from editableContent using the path
    const getValue = () => {
      if (!path.includes('.')) {
        return editableContent[path] || content;
      }
      
      const parts = path.split('.');
      let current = editableContent;
      
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes('[') && parts[i].includes(']')) {
          const arrName = parts[i].split('[')[0];
          const arrIndex = parseInt(parts[i].split('[')[1].split(']')[0]);
          
          if (!current[arrName] || !current[arrName][arrIndex]) {
            return content; // Return default if path doesn't exist
          }
          
          current = current[arrName][arrIndex];
        } else {
          if (!current[parts[i]]) {
            return content; // Return default if path doesn't exist
          }
          current = current[parts[i]];
        }
      }
      
      return current;
    };
    
    // Get the current value to display
    const displayValue = getValue();
    
    // Initialize local text state when editing starts
    useEffect(() => {
      if (isEditing) {
        setLocalText(displayValue);
      }
    }, [isEditing, displayValue]);
    
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);
    
    const handleDoubleClick = () => {
      if (editMode) {
        setIsEditing(true);
      }
    };
    
    const handleBlur = () => {
      setIsEditing(false);
      handleTextEdit(path, localText);
    };
    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        handleTextEdit(path, localText);
      }
    };
    
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-transparent outline-none border-b border-indigo-500 ${className}`}
        />
      );
    }
    
    return (
      <span 
        className={`${className} ${editMode ? 'cursor-text hover:bg-slate-700/30' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        {displayValue}
      </span>
    );
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, duration: 0.6 }
    },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] } 
    },
    hover: { 
      y: -10, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 overflow-x-hidden">
      {/* Three.js Background Canvas */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <SafeAnimatedBackground />
          <SafeFloatingObject position={[-5, 3, -2]} size={0.5} color="#6366f1" speed={1} />
          <SafeFloatingObject position={[5, -3, -2]} size={0.7} color="#8b5cf6" speed={0.7} />
          <SafeFloatingObject position={[7, 5, -5]} size={1} color="#ec4899" speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotateZ: [0, 180, 360] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut" 
              }}
              className="relative h-24 w-24"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <FaRocket size={40} className="text-indigo-500" />
              </div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </motion.div>
            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute mt-32 text-xl font-bold text-indigo-400"
            >
              Initializing Innovation...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fixed Navigation - Converted from sidebar to top navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 py-4 px-6 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-indigo-500 cursor-pointer"
        >
          <Link to="/dashboard/portfolio">
            <FaRocket size={28} />
          </Link>
        </motion.div>
        
        <div className="flex items-center space-x-8">
          {[
            { id: 'home', icon: <FaUserAstronaut size={20} />, label: 'Home' },
            { id: 'projects', icon: <FaBriefcase size={20} />, label: 'Projects' },
            { id: 'skills', icon: <FaCode size={20} />, label: 'Skills' },
            { id: 'github', icon: <FaGithub size={20} />, label: 'GitHub' },
            { id: 'analytics', icon: <FaChartLine size={20} />, label: 'Analytics' }
          ].map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.1, color: "#6366f1" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavClick(item.id)}
              className={`cursor-pointer transition-colors flex items-center ${activeSection === item.id ? 'text-indigo-500' : 'text-slate-400'}`}
            >
              <span className="mr-1">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditMode(!editMode)}
            className={`${editMode ? 'text-green-500' : 'text-slate-400'} hover:text-indigo-500 cursor-pointer`}
          >
            {editMode ? <FaCheck size={20} /> : <FaEdit size={20} />}
          </motion.div>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleResetContent}
              className="text-red-500 hover:text-red-400 cursor-pointer"
              title="Reset to default content"
            >
              <FaTimes size={20} />
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="text-slate-400 hover:text-indigo-500 cursor-pointer"
          >
            <FaCog size={20} />
          </motion.div>
        </div>
      </nav>
      
      {/* Main Content - Updated to remove sidebar margin */}
      <main className="relative z-10">
        {/* Header Banner - Fixed Position - Updated width */}
        <motion.div 
          style={{ opacity, scale }}
          className="fixed top-16 w-full z-30 bg-slate-900/70 backdrop-blur-md border-b border-slate-800 flex justify-between items-center px-8 py-4"
        >
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl font-bold text-white"
          >
            <EditableText 
              path="siteName" 
              content="Elevate" 
              className="text-white" 
            />
            <span className="text-indigo-500">
              <EditableText 
                path="siteNameAccent" 
                content="OS" 
                className="text-indigo-500" 
              />
            </span>
          </motion.h1>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center space-x-6"
          >
            {editMode && (
              <div className="px-4 py-1 bg-green-900/50 text-green-400 rounded-md text-sm animate-pulse">
                Edit Mode Active
              </div>
            )}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-indigo-500 cursor-pointer"
            >
              <FaBell size={20} />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center overflow-hidden mr-3 border-2 border-indigo-500">
                <img 
                  src={editableContent.profile.avatar} 
                  alt={editableContent.profile.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  <EditableText 
                    path="profile.name" 
                    content={editableContent.profile.name} 
                    className="text-white" 
                  />
                </h3>
                <p className="text-xs text-slate-400">
                  <EditableText 
                    path="profile.role" 
                    content={editableContent.profile.role} 
                    className="text-slate-400" 
                  />
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scrollable Content with padding for fixed header - Updated top padding */}
        <div className="pt-36 pb-20 px-8">
          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.div
                key="home"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                {/* Hero Section */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col lg:flex-row items-center justify-between gap-10 min-h-[50vh] py-20"
                >
                  <div className="lg:w-1/2">
                    <motion.h1 
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-5xl font-bold mb-4 text-white"
                    >
                      <EditableText 
                        path="hero.line1" 
                        content="Innovate." 
                        className="text-white block" 
                      /> <br />
                      <span className="text-indigo-500">
                        <EditableText 
                          path="hero.line2" 
                          content="Create." 
                          className="text-indigo-500" 
                        />
                      </span> <br />
                      <EditableText 
                        path="hero.line3" 
                        content="Transform." 
                        className="text-white" 
                      />
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-xl text-slate-300 mb-8 leading-relaxed"
                    >
                      <EditableText 
                        path="hero.description" 
                        content="Pushing the boundaries of what's possible through cutting-edge development and innovative solutions." 
                        className="text-slate-300" 
                      />
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex space-x-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg"
                      >
                        <EditableText 
                          path="hero.button1" 
                          content="View Projects" 
                          className="text-white" 
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border border-slate-600 text-slate-300 font-medium rounded-lg"
                      >
                        <EditableText 
                          path="hero.button2" 
                          content="Contact Me" 
                          className="text-slate-300" 
                        />
                      </motion.button>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="lg:w-1/2 h-[400px] relative"
                  >
                    <Canvas>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <SafeAnimatedText3D text="ElevateOS" position={[-3, 0, 0]} size={1.5} />
                      <OrbitControls enableZoom={false} />
                    </Canvas>
                  </motion.div>
                </motion.div>
                
                {/* Profile Section */}
                <motion.div 
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
                >
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row items-center">
                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="h-40 w-40 rounded-full bg-indigo-900 flex items-center justify-center overflow-hidden mb-6 md:mb-0 md:mr-8 border-4 border-indigo-500 shadow-lg"
                      >
                        <img 
                          src={editableContent.profile.avatar} 
                          alt={editableContent.profile.name} 
                          className="h-full w-full object-cover" 
                        />
                      </motion.div>
                      <div className="text-center md:text-left">
                        <motion.h2 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-3xl font-bold text-white mb-2"
                        >
                          <EditableText 
                            path="profile.name" 
                            content={editableContent.profile.name} 
                            className="text-white" 
                          />
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-indigo-400 font-medium text-xl mb-3"
                        >
                          <EditableText 
                            path="profile.role" 
                            content={editableContent.profile.role} 
                            className="text-indigo-400" 
                          />
                        </motion.p>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-slate-300 mb-6 max-w-xl"
                        >
                          <EditableText 
                            path="profile.bio" 
                            content={editableContent.profile.bio} 
                            className="text-slate-300" 
                          />
                        </motion.p>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center md:justify-start space-x-4"
                        >
                          <motion.a
                            href={editableContent.profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, rotate: 5, backgroundColor: "#4f46e5" }}
                            whileTap={{ scale: 0.9 }}
                            className="h-12 w-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white"
                          >
                            <FaGithub size={24} />
                          </motion.a>
                          <motion.a
                            href={editableContent.profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, rotate: -5, backgroundColor: "#4f46e5" }}
                            whileTap={{ scale: 0.9 }}
                            className="h-12 w-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white"
                          >
                            <FaLinkedin size={24} />
                          </motion.a>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Featured Projects */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    <EditableText 
                      path="featured.title" 
                      content="Featured Projects" 
                      className="text-white" 
                    />
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {editableContent.projects.featuredProjects.map((project, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredSkill(index)}
                        onClick={() => setActiveSection('projects')}
                        className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 cursor-pointer group"
                      >
                        <div className="h-48 overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={project.thumbnail}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                            <EditableText 
                              path={`projects.featuredProjects[${index}].name`} 
                              content={project.name} 
                              className="text-white group-hover:text-indigo-400" 
                            />
                          </h3>
                          <p className="text-slate-300 mb-4">
                            <EditableText 
                              path={`projects.featuredProjects[${index}].description`} 
                              content={project.description} 
                              className="text-slate-300" 
                            />
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300"
                              >
                                <EditableText 
                                  path={`projects.featuredProjects[${index}].technologies[${techIndex}]`} 
                                  content={tech} 
                                  className="text-slate-300" 
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Timeline Section */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Professional Journey</h2>
                  <div className="relative border-l-2 border-indigo-500 pl-8 py-4 ml-4 space-y-12">
                    {editableContent.timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          viewport={{ once: true }}
                          className="absolute -left-12 h-6 w-6 rounded-full bg-indigo-500 border-4 border-slate-900"
                        />
                        <span className="inline-block text-indigo-400 font-bold mb-1">{item.year}</span>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-300">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Testimonials */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">What Others Say</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {editableContent.testimonials.map((testimonial, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700"
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-indigo-500" 
                          />
                          <div>
                            <h3 className="font-bold text-white">{testimonial.name}</h3>
                            <p className="text-indigo-400 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 italic">"{testimonial.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 'projects' && (
              <motion.div
                key="projects"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Projects</h2>
                    <div className="flex space-x-2">
                      <motion.div 
                        whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 rounded-md text-white cursor-pointer"
                      >
                        All
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-slate-700 rounded-md text-slate-300 cursor-pointer"
                      >
                        Web
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-slate-700 rounded-md text-slate-300 cursor-pointer"
                      >
                        Mobile
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-slate-700 rounded-md text-slate-300 cursor-pointer"
                      >
                        AI
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Project Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div 
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-green-900/20 p-6 rounded-lg text-center border border-green-800"
                    >
                      <motion.h3 
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-bold text-green-400 mb-2"
                      >
                        {editableContent.projects.completed}
                      </motion.h3>
                      <p className="text-slate-300">Completed</p>
                    </motion.div>
                    <motion.div 
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-blue-900/20 p-6 rounded-lg text-center border border-blue-800"
                    >
                      <motion.h3 
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-bold text-blue-400 mb-2"
                      >
                        {editableContent.projects.inProgress}
                      </motion.h3>
                      <p className="text-slate-300">In Progress</p>
                    </motion.div>
                    <motion.div 
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-purple-900/20 p-6 rounded-lg text-center border border-purple-800"
                    >
                      <motion.h3 
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-bold text-purple-400 mb-2"
                      >
                        {editableContent.projects.upcoming}
                      </motion.h3>
                      <p className="text-slate-300">Upcoming</p>
                    </motion.div>
                    <motion.div 
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-indigo-900/20 p-6 rounded-lg text-center border border-indigo-800"
                    >
                      <motion.h3 
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-bold text-indigo-400 mb-2"
                      >
                        {editableContent.projects.teamMembers}
                      </motion.h3>
                      <p className="text-slate-300">Team Members</p>
                    </motion.div>
                  </div>
                  
                  {/* Next Milestone */}
                  <motion.div 
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl mb-10 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Next Milestone</h3>
                      <div className="px-3 py-1 bg-indigo-900/50 text-indigo-400 rounded-md text-sm">
                        {editableContent.projects.daysToMilestone} days left
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-indigo-400 mb-4">{editableContent.projects.nextMilestone}</h4>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-indigo-500 h-2.5 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Development</span>
                      <span>Testing</span>
                      <span>Launch</span>
                    </div>
                  </motion.div>
                  
                  {/* Extended Project List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...editableContent.projects.featuredProjects, 
                      {
                        name: "AI Content Generator",
                        description: "GPT-powered tool for creating marketing copy and creative content",
                        technologies: ["React", "OpenAI API", "Node.js", "Express"],
                        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000"
                      },
                      {
                        name: "Blockchain Wallet",
                        description: "Secure cryptocurrency wallet with multi-chain support",
                        technologies: ["React", "Web3.js", "Solidity", "Next.js"],
                        thumbnail: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=1000"
                      },
                      {
                        name: "Smart Home Dashboard",
                        description: "IoT control center for connected home devices",
                        technologies: ["React", "Node.js", "MQTT", "Chart.js"],
                        thumbnail: "https://images.unsplash.com/photo-1558002038-bb0237f1b8c7?q=80&w=1000"
                      }
                    ].map((project, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredSkill(index)}
                        className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 cursor-pointer group"
                      >
                        <div className="h-48 overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={project.thumbnail}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-slate-300 mb-4">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 'skills' && (
              <motion.div
                key="skills"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-white mb-8">Technical Expertise</h2>
                  
                  {/* 3D Skills Visualization */}
                  <motion.div 
                    variants={cardVariants}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 mb-12"
                  >
                    <div className="h-64 relative">
                      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={0.8} color="#6366f1" />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                        
                        {editableContent.skills.map((skill, index) => {
                          const angle = (index / editableContent.skills.length) * Math.PI * 2;
                          const radius = 4;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          
                          return (
                            <mesh 
                              key={index}
                              position={[x, y, 0]}
                              scale={[skill.level / 100, skill.level / 100, skill.level / 100]}
                            >
                              <sphereGeometry args={[0.5, 32, 32]} />
                              <meshStandardMaterial 
                                color={hoveredSkill === index ? "#6366f1" : "#4f46e5"} 
                                wireframe={hoveredSkill === index}
                              />
                            </mesh>
                          );
                        })}
                        
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                      </Canvas>
                    </div>
                  </motion.div>
                  
                  {/* Skill Bars */}
                  <div className="space-y-6">
                    {editableContent.skills.map((skill, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        onMouseEnter={() => {
                          setHoveredSkill(index);
                        }}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-white">{skill.name}</h3>
                          <span className="text-indigo-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                            className="bg-indigo-500 h-2.5 rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Areas of Expertise */}
                  <motion.div 
                    variants={cardVariants}
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {[
                      {
                        title: "Frontend Development",
                        description: "Creating responsive, accessible, and performant user interfaces with modern frameworks",
                        icon: <FaCode size={24} />
                      },
                      {
                        title: "Backend Architecture",
                        description: "Building scalable, secure API services and database systems",
                        icon: <FaCog size={24} />
                      },
                      {
                        title: "Creative Technology",
                        description: "Implementing interactive 3D visualizations and animations for unique user experiences",
                        icon: <FaRocket size={24} />
                      }
                    ].map((area, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                      >
                        <div className="text-indigo-500 mb-4">{area.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                        <p className="text-slate-300">{area.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 'github' && (
              <motion.div
                key="github"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">GitHub</h2>
                    <motion.a
                      href={editableContent.profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-indigo-600 rounded-md text-white"
                    >
                      <FaGithub className="mr-2" />
                      View Profile
                    </motion.a>
                  </div>
                  
                  {/* GitHub Stats */}
                  <motion.div 
                    variants={cardVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl text-center border border-slate-700"
                    >
                      <FaCode className="text-indigo-400 mx-auto mb-2" size={24} />
                      <h3 className="text-3xl font-bold text-white mb-1">{editableContent.github.repos}</h3>
                      <p className="text-slate-400 text-sm">Repositories</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl text-center border border-slate-700"
                    >
                      <FaStar className="text-yellow-400 mx-auto mb-2" size={24} />
                      <h3 className="text-3xl font-bold text-white mb-1">{editableContent.github.stars}</h3>
                      <p className="text-slate-400 text-sm">Stars</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl text-center border border-slate-700"
                    >
                      <FaUsers className="text-blue-400 mx-auto mb-2" size={24} />
                      <h3 className="text-3xl font-bold text-white mb-1">{editableContent.github.followers}</h3>
                      <p className="text-slate-400 text-sm">Followers</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl text-center border border-slate-700"
                    >
                      <FaRocket className="text-green-400 mx-auto mb-2" size={24} />
                      <h3 className="text-3xl font-bold text-white mb-1">{editableContent.github.contributions}</h3>
                      <p className="text-slate-400 text-sm">Contributions</p>
                    </motion.div>
                  </motion.div>
                  
                  {/* Contribution Graph */}
                  <motion.div 
                    variants={cardVariants}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 mb-10 border border-slate-700"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Contribution Activity</h3>
                    <div className="flex flex-wrap gap-1">
                      {Array(52).fill(0).map((_, weekIndex) => (
                        <div key={`week_${weekIndex}`} className="flex flex-col gap-1">
                          {Array(7).fill(0).map((_, dayIndex) => {
                            const intensity = Math.random();
                            let bgColor = "bg-slate-700";
                            
                            if (intensity > 0.9) bgColor = "bg-green-500";
                            else if (intensity > 0.7) bgColor = "bg-green-600/80";
                            else if (intensity > 0.5) bgColor = "bg-green-700/60";
                            else if (intensity > 0.3) bgColor = "bg-green-800/40";
                            
                            return (
                              <motion.div
                                key={`day_${weekIndex}_${dayIndex}`}
                                whileHover={{ scale: 1.5 }}
                                className={`${bgColor} h-3 w-3 rounded-sm`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Top Repositories */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-bold text-white mb-4">Top Repositories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {editableContent.github.topRepos.map((repo, index) => (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          whileHover="hover"
                          className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                        >
                          <div className="flex justify-between mb-3">
                            <h4 className="text-lg font-bold text-white">{repo.name}</h4>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="text-slate-300">{repo.stars}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mb-4">
                            <span className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300">
                              {repo.language}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${(repo.stars / 25) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>Activity</span>
                            <span>Updated 3 days ago</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 'analytics' && (
              <motion.div
                key="analytics"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-white mb-6">Performance Analytics</h2>
                  
                  <motion.div 
                    variants={cardVariants}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 mb-10 border border-slate-700"
                  >
                    <h3 className="text-xl font-bold text-white mb-6 text-center">{editableContent.analytics.summary}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-green-900/30 to-green-700/10 p-6 rounded-xl text-center"
                      >
                        <div className="text-3xl font-bold text-green-400 mb-2">{editableContent.analytics.growth}</div>
                        <p className="text-slate-300">Growth</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-blue-900/30 to-blue-700/10 p-6 rounded-xl text-center"
                      >
                        <div className="text-3xl font-bold text-blue-400 mb-2">{editableContent.analytics.efficiency}</div>
                        <p className="text-slate-300">Efficiency</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-purple-900/30 to-purple-700/10 p-6 rounded-xl text-center"
                      >
                        <div className="text-3xl font-bold text-purple-400 mb-2">{editableContent.analytics.innovation}</div>
                        <p className="text-slate-300">Innovation</p>
                      </motion.div>
                    </div>
                    
                    {/* Interactive Chart */}
                    <div className="h-80 mb-4">
                      <Canvas>
                        <ambientLight intensity={0.4} />
                        <pointLight position={[10, 10, 10]} intensity={0.6} />
                        <group position={[0, 0, 0]}>
                          {editableContent.analytics.trends.map((value, index) => {
                            const x = (index - 3) * 1.5;
                            const height = value / 20;
                            
                            return (
                              <mesh key={index} position={[x, height/2 - 2, 0]}>
                                <boxGeometry args={[0.8, height, 0.8]} />
                                <meshStandardMaterial 
                                  color={`hsl(${240 + index * 10}, 80%, 60%)`}
                                  metalness={0.4}
                                  roughness={0.2}
                                />
                              </mesh>
                            );
                          })}
                        </group>
                        <OrbitControls enableZoom={false} enablePan={false} />
                      </Canvas>
                    </div>
                    
                    <div className="flex justify-between text-sm text-slate-400 px-2">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                    </div>
                  </motion.div>
                  
                  {/* Performance Metrics */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: "Code Quality", value: "A+", icon: <FaCode />, color: "text-green-400" },
                        { name: "Test Coverage", value: "94%", icon: <FaCog />, color: "text-blue-400" },
                        { name: "System Reliability", value: "99.9%", icon: <FaRocket />, color: "text-purple-400" },
                        { name: "User Satisfaction", value: "4.9/5", icon: <FaUsers />, color: "text-yellow-400" }
                      ].map((metric, index) => (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          whileHover="hover"
                          className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                        >
                          <div className="flex items-center mb-4">
                            <div className={`${metric.color} mr-3`}>{metric.icon}</div>
                            <h4 className="text-white font-bold">{metric.name}</h4>
                          </div>
                          <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${90 + index * 2}%` }}
                            ></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Floating Action Button with Edit Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed z-40 bottom-8 right-8 flex flex-col space-y-4"
      >
        {editMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="bg-green-600/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm"
          >
            Double-click text to edit
          </motion.div>
        )}
        <AnimatePresence>
          {editMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleResetContent}
              className="bg-red-500 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg absolute bottom-40 right-0"
              title="Reset to default content"
            >
              <FaTimes size={24} />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setEditMode(!editMode)}
          className={`${editMode ? 'bg-green-600' : 'bg-indigo-600'} text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg absolute bottom-20 right-0`}
        >
          {editMode ? <FaCheck size={24} /> : <FaEdit size={24} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
        >
          <FaRocket size={24} />
        </motion.button>
      </motion.div>
      
      {/* Footer - Updated to remove sidebar margin */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="py-6 px-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm text-center"
      >
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} 
          <EditableText 
            path="footer.brand" 
            content="ElevateOS" 
            className="text-slate-400" 
          />. Built with React, Three.js, and Framer Motion. 
          <span className="text-indigo-400">
            <EditableText 
              path="footer.tagline" 
              content=" Innovating for tomorrow." 
              className="text-indigo-400" 
            />
          </span>
        </p>
      </motion.footer>
    </div>
  );
}

// Custom hook for Framer Motion scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [ref, inView] = useInView({ threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

// Adding export for the hook so it can be used in other components
export { useScrollAnimation };

// Error boundary component to prevent Three.js errors from crashing the app
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-md text-center">
          <p className="text-red-300">Something went wrong with this component.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-700 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a higher-order component for Three.js components
export const withErrorBoundary = (Component) => {
  return (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Create a safe version of the 3D components
const SafeAnimatedBackground = withErrorBoundary(AnimatedBackground);
const SafeFloatingObject = withErrorBoundary(FloatingObject);
const SafeAnimatedText3D = withErrorBoundary(AnimatedText3D);