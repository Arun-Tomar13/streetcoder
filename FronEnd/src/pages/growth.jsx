import { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import theme from '../theme';

function Growth() {
  const [selectedTab, setSelectedTab] = useState('personal');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Animation states
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Refs for animation triggers
  const statsRef = useRef(null);
  const milestonesRef = useRef(null);
  const learningRef = useRef(null);
  
  // Check if elements are in view
  const statsInView = useInView(statsRef, { once: false, amount: 0.2 });
  const milestonesInView = useInView(milestonesRef, { once: false, amount: 0.2 });
  const learningInView = useInView(learningRef, { once: false, amount: 0.2 });

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic'
    });
    
    // Refresh AOS when the tab changes
    AOS.refresh();
    
    // Start with a slight delay to ensure everything is rendered
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setHasLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [selectedTab]);

  // Page entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const stats = {
    personal: [
      { value: '85%', label: 'Problem Solving', color: theme.colors.teal[500] },
      { value: '92%', label: 'Critical Thinking', color: theme.colors.accent.mint },
      { value: '78%', label: 'Communication', color: theme.colors.accent.pink },
      { value: '89%', label: 'Adaptability', color: theme.colors.accent.blue }
    ],
    team: [
      { value: '94%', label: 'Collaboration', color: theme.colors.teal[500] },
      { value: '88%', label: 'Project Completion', color: theme.colors.accent.mint },
      { value: '82%', label: 'Innovation Rate', color: theme.colors.accent.pink },
      { value: '95%', label: 'Team Satisfaction', color: theme.colors.accent.blue }
    ],
    organization: [
      { value: '76%', label: 'Resource Efficiency', color: theme.colors.teal[500] },
      { value: '91%', label: 'Growth Rate', color: theme.colors.accent.mint },
      { value: '84%', label: 'Compliance', color: theme.colors.accent.pink },
      { value: '89%', label: 'Customer Satisfaction', color: theme.colors.accent.blue }
    ]
  };

  const milestones = [
    { 
      title: "Onboarding Complete", 
      description: "Successfully completed all onboarding requirements and training modules.", 
      date: "January 2023",
      icon: "🚀",
      color: theme.colors.teal[500]
    },
    { 
      title: "First Project Completion", 
      description: "Successfully delivered your first major project ahead of schedule.", 
      date: "March 2023",
      icon: "🏆",
      color: theme.colors.accent.mint
    },
    { 
      title: "Team Lead Certification", 
      description: "Achieved team leadership certification through advanced coursework.", 
      date: "June 2023",
      icon: "📊",
      color: theme.colors.accent.pink
    },
    { 
      title: "Innovation Award", 
      description: "Recognized for outstanding contributions to product innovation.", 
      date: "October 2023",
      icon: "💡",
      color: theme.colors.accent.blue
    },
    { 
      title: "Performance Excellence", 
      description: "Maintained consistently high performance ratings for three consecutive quarters.", 
      date: "December 2023",
      icon: "⭐",
      color: theme.colors.teal[600]
    }
  ];
  
  const learningPaths = [
    {
      title: "Advanced Problem Solving",
      progress: 65,
      modules: 8,
      completedModules: 5,
      color: theme.colors.teal[500]
    },
    {
      title: "Leadership Mastery",
      progress: 42,
      modules: 12,
      completedModules: 5,
      color: theme.colors.accent.mint
    },
    {
      title: "Technical Excellence",
      progress: 78,
      modules: 10,
      completedModules: 8,
      color: theme.colors.accent.pink
    },
    {
      title: "Communication Skills",
      progress: 90,
      modules: 6,
      completedModules: 5,
      color: theme.colors.accent.blue
    }
  ];

  const renderStatCards = (category) => {
    return stats[category].map((stat, index) => (
      <motion.div
        key={index}
        className="relative bg-white rounded-xl p-6 shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        whileHover={{ 
          y: -10, 
          boxShadow: theme.shadows.xl,
          transition: { duration: 0.2 }
        }}
        data-aos="fade-up"
        data-aos-delay={100 * index}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <motion.div 
          className="absolute top-0 left-0 h-2 w-full"
          style={{ background: stat.color }}
          whileHover={{ height: '4px' }}
        />
        <motion.h3 
          className="text-4xl font-bold mb-2" 
          style={{ color: stat.color }}
          animate={hoveredCard === index ? { 
            scale: [1, 1.1, 1],
            transition: { duration: 0.5 }
          } : {}}
        >
          {stat.value}
        </motion.h3>
        <p className="text-gray-600">{stat.label}</p>
        
        <motion.div
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10"
          style={{ background: stat.color }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {hoveredCard === index && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${stat.color}10 0%, transparent 70%)`,
              zIndex: 0
            }}
          />
        )}
      </motion.div>
    ));
  };

  const renderMilestones = () => {
    return (
      <div className="relative">
        <motion.div 
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="relative mb-10"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            data-aos-delay={150 * index}
            data-aos-duration="800"
          >
            <div className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="w-1/2 px-4"></div>
              
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 text-xl"
                style={{ 
                  background: milestone.color,
                  color: '#fff',
                  boxShadow: theme.shadows.md
                }}
                whileHover={{ scale: 1.2 }}
                animate={{
                  boxShadow: [
                    `0 0 0 0px ${milestone.color}50`,
                    `0 0 0 10px ${milestone.color}00`
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                {milestone.icon}
              </motion.div>
              
              <motion.div 
                className="w-1/2 px-4"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-md"
                  whileHover={{
                    boxShadow: `0 10px 25px -5px ${milestone.color}30`,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="text-sm mb-1" 
                    style={{ color: milestone.color }}
                    whileHover={{ fontWeight: 'bold' }}
                  >
                    {milestone.date}
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm">{milestone.description}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderLearningPaths = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {learningPaths.map((path, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 * index }}
            whileHover={{ 
              y: -10, 
              boxShadow: theme.shadows.xl,
              transition: { duration: 0.2 }
            }}
            data-aos="zoom-in-up"
            data-aos-delay={100 * index}
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <div className="flex flex-col h-full">
              <div className="h-40 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r"
                  style={{ 
                    background: `linear-gradient(135deg, ${path.color}90, ${theme.colors.accent.blue}80)`,
                    opacity: 0.9 
                  }}
                />
                
                <motion.div 
                  className="absolute z-10 inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                  >
                    <span className="text-3xl">{
                      index === 0 ? '💡' : 
                      index === 1 ? '👥' : 
                      index === 2 ? '💻' : 
                      '🔊'
                    }</span>
                  </motion.div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col text-white z-10">
                  <motion.h3 
                    className="font-bold text-xl mb-1"
                    initial={{ y: 0 }}
                    whileHover={{ y: -3 }}
                  >
                    {path.title}
                  </motion.h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">{path.completedModules} of {path.modules} modules</span>
                  <motion.span 
                    className="text-sm font-bold px-2 py-1 rounded-full" 
                    style={{ 
                      color: 'white',
                      background: path.color
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {path.progress}%
                  </motion.span>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1 mb-4">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: path.color, width: '0%' }}
                    animate={{ width: `${path.progress}%` }}
                    transition={{ 
                      duration: 1, 
                      delay: 0.5,
                      ease: "easeOut" 
                    }}
                  />
                </div>
                
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      className="mt-2 overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-600 text-sm mb-4">
                        Continue your learning journey through interactive modules designed to enhance your skills.
                      </p>
                      <motion.button
                        className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium overflow-hidden relative"
                        style={{ background: path.color }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: `0 4px 15px -3px ${path.color}50` 
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div 
                          className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                          style={{ 
                            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                            backgroundSize: "200% 200%",
                            backgroundPosition: "0% 0%"
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "200% 200%"]
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "mirror"
                          }}
                        />
                        <span className="relative z-10">Continue Learning</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="flex min-h-screen overflow-hidden growth-container" 
      style={{ 
        background: theme.gradients.pageBackground,
        position: 'relative'
      }}
      initial="hidden"
      animate={hasLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Toaster position="top-right" toastOptions={{ style: { background: theme.colors.background.light, color: theme.colors.text.primary } }} />
      
      {/* Page loading animation */}
      <AnimatePresence>
        {!hasLoaded && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 0],
                borderRadius: ["20%", "50%", "20%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              style={{ 
                width: 80, 
                height: 80,
                background: theme.gradients.buttonGradient
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative circles with enhanced animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute rounded-full" 
          style={{ 
            width: '500px', 
            height: '500px', 
            top: '-15%', 
            left: '-10%', 
            border: '1px solid rgba(255,255,255,0.1)',
            filter: 'blur(0.5px)' 
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0],
            x: [0, 20, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute rounded-full" 
          style={{ 
            width: '300px', 
            height: '300px', 
            bottom: '10%', 
            right: '5%', 
            border: '1px solid rgba(255,255,255,0.15)',
            filter: 'blur(0.5px)' 
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -3, 0],
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute" 
          style={{ 
            width: '100px', 
            height: '100px', 
            bottom: '20%', 
            left: '10%', 
            background: `linear-gradient(135deg, ${theme.colors.teal[500]}20, ${theme.colors.accent.mint}20)`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(10px)' 
          }}
          animate={{
            borderRadius: [
              '30% 70% 70% 30% / 30% 30% 70% 70%',
              '60% 40% 30% 70% / 60% 30% 70% 40%',
              '30% 70% 70% 30% / 30% 30% 70% 70%'
            ],
            rotate: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute" 
          style={{ 
            width: '150px', 
            height: '150px', 
            top: '20%', 
            right: '15%', 
            background: `linear-gradient(135deg, ${theme.colors.accent.pink}20, ${theme.colors.teal[500]}20)`,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(15px)' 
          }}
          animate={{
            borderRadius: [
              '60% 40% 30% 70% / 60% 30% 70% 40%',
              '30% 60% 70% 40% / 50% 60% 30% 60%',
              '60% 40% 30% 70% / 60% 30% 70% 40%'
            ],
            rotate: [0, -15, 0],
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Background floating particles with enhanced animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(1px)",
              opacity: 0.15,
              backgroundColor: i % 4 === 0 ? theme.colors.teal[500] : 
                              i % 4 === 1 ? theme.colors.accent.mint : 
                              i % 4 === 2 ? theme.colors.accent.pink : 
                              theme.colors.accent.blue,
            }}
            animate={{
              y: [0, Math.random() * -50 - 10],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0.15, 0.3, 0.15],
              scale: [1, Math.random() * 0.5 + 1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Main content container with enhanced glass effect */}
      <motion.div
        className="container mx-auto my-10 overflow-hidden rounded-2xl shadow-xl"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
        variants={itemVariants}
        whileHover={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.15)`,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          transition: { duration: 0.5 }
        }}
      >
        {/* Header with enhanced animations */}
        <motion.div 
          className="p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          data-aos="fade-down"
          data-aos-duration="800"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.span
              className="inline-block bg-clip-text text-transparent"
              style={{ 
                background: theme.gradients.buttonGradient,
                WebkitBackgroundClip: 'text'
              }}
              animate={{ 
                backgroundPosition: ['0% center', '100% center', '0% center'],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "mirror" 
              }}
              whileHover={{
                letterSpacing: "1px",
                transition: { duration: 0.3 }
              }}
            >
              Your Growth Journey
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Track your progress, celebrate milestones, and discover new opportunities for development.
          </motion.p>
        </motion.div>
        
        {/* Tab Navigation with enhanced animations */}
        <motion.div 
          className="flex justify-center mb-8 px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <motion.div 
            className="bg-gray-100 p-1 rounded-xl inline-flex"
            whileHover={{ 
              boxShadow: "0 4px 15px -3px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            {['personal', 'team', 'organization'].map((tab) => (
              <motion.button
                key={tab}
                className={`px-6 py-2 rounded-lg font-medium relative ${selectedTab === tab ? 'text-white' : 'text-gray-500'}`}
                onClick={() => setSelectedTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedTab === tab && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ background: theme.gradients.buttonGradient }}
                    layoutId="tabHighlight"
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
          
        {/* Content sections */}
        <div className="p-6 md:p-8">
          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            layout
            ref={statsRef}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {renderStatCards(selectedTab)}
          </motion.div>
          
          {/* Section: Milestones */}
          <motion.div 
            className="mb-16"
            ref={milestonesRef}
            animate={milestonesInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 20 }}
            transition={{ duration: 0.5 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center mb-8">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white text-xl"
                style={{ background: theme.gradients.buttonGradient }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0px rgba(79, 209, 197, 0.3)',
                    '0 0 0 10px rgba(79, 209, 197, 0)'
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🏆
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold"
                whileHover={{
                  letterSpacing: "0.5px",
                  transition: { duration: 0.3 }
                }}
              >
                Milestones & Achievements
              </motion.h2>
            </div>
            
            {renderMilestones()}
          </motion.div>
          
          {/* Section: Learning Paths */}
          <motion.div
            ref={learningRef}
            animate={learningInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 20 }}
            transition={{ duration: 0.5 }}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex items-center mb-8">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white text-xl"
                style={{ background: theme.gradients.buttonGradient }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0px rgba(79, 209, 197, 0.3)',
                    '0 0 0 10px rgba(79, 209, 197, 0)'
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                📚
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold"
                whileHover={{
                  letterSpacing: "0.5px",
                  transition: { duration: 0.3 }
                }}
              >
                Learning Paths
              </motion.h2>
            </div>
            
            {renderLearningPaths()}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-14 rounded-full border-2 border-white justify-center items-start p-2 opacity-50 hidden md:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div 
          className="w-1 h-3 bg-white rounded-full"
          animate={{ 
            y: [0, 8, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            repeatType: "loop"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default Growth;
