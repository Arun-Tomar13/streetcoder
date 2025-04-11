import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import "../App.css";
import axios from 'axios';
import { motion } from 'framer-motion';
import theme from '../theme';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  // Preload animation state
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Start with a slight delay to ensure everything is rendered
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const response = await axios.post('http://localhost:3000/signin', {
        email: formData.get('email'),
        password: formData.get('password')
      });

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Success animation
      toast.success('Login successful!');
      
      // Animation before redirect
      document.querySelector('.login-container').classList.add('fade-out');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden login-container" style={{ 
      background: theme.gradients.pageBackground,
      position: 'relative'
    }}>
      <Toaster position="top-right" toastOptions={{ style: { background: theme.colors.background.light, color: theme.colors.text.primary } }} />
      
      {/* Decorative circles */}
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
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Background animated elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
              backgroundColor: i % 3 === 0 ? theme.colors.teal[500] : i % 3 === 1 ? theme.colors.accent.mint : theme.colors.accent.pink,
            }}
            animate={{
              y: [0, Math.random() * -30 - 10],
              x: [0, (Math.random() - 0.5) * 20],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Main content container with glass effect */}
      <motion.div
        className="relative mx-auto my-auto overflow-hidden rounded-2xl shadow-xl"
        style={{ 
          width: '90%', 
          maxWidth: '1200px', 
          height: '85vh',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex h-full">
          {/* Left side - Login Form */}
          <motion.div 
            className="w-1/2 flex items-center justify-center p-8 relative z-10"
            style={{ background: theme.colors.background.light }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <motion.div 
              className="w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div className="mb-8">
                <motion.h2 
                  className="text-4xl font-bold mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
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
                  >
                    Welcome Back
                  </motion.span>
                </motion.h2>
                
                <motion.p 
                  style={{ color: theme.colors.text.secondary }}
                  className="text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Sign in to continue to your account
                </motion.p>
              </motion.div>
              
              <motion.form 
                className="space-y-5"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <label 
                    htmlFor="email" 
                    className={`block text-sm font-medium mb-1.5 transition-colors duration-300`}
                    style={{ color: currentField === 'email' ? theme.colors.teal[500] : theme.colors.text.secondary }}
                  >
                    Email
                  </label>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: theme.shadows.input }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5"
                      style={{ background: theme.gradients.buttonGradient }}
                      initial={{ width: "0%" }}
                      animate={{ width: currentField === 'email' ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                      style={{ 
                        backgroundColor: theme.colors.background.card,
                        color: theme.colors.text.primary,
                        border: `1px solid ${currentField === 'email' ? theme.colors.teal[500] : '#E5E7EB'}`
                      }}
                      placeholder="Enter your email"
                      onFocus={() => setCurrentField('email')}
                      onBlur={() => setCurrentField(null)}
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <label 
                    htmlFor="password" 
                    className={`block text-sm font-medium mb-1.5 transition-colors duration-300`}
                    style={{ color: currentField === 'password' ? theme.colors.teal[500] : theme.colors.text.secondary }}
                  >
                    Password
                  </label>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: theme.shadows.input }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5"
                      style={{ background: theme.gradients.buttonGradient }}
                      initial={{ width: "0%" }}
                      animate={{ width: currentField === 'password' ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                      style={{ 
                        backgroundColor: theme.colors.background.card,
                        color: theme.colors.text.primary,
                        border: `1px solid ${currentField === 'password' ? theme.colors.teal[500] : '#E5E7EB'}`
                      }}
                      placeholder="Enter your password"
                      onFocus={() => setCurrentField('password')}
                      onBlur={() => setCurrentField(null)}
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <motion.a 
                    href="/forgot-password" 
                    className="text-sm font-medium relative inline-block"
                    style={{ color: theme.colors.teal[500] }}
                    whileHover={{ color: theme.colors.teal[600], scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Forgot password?
                  </motion.a>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 font-medium rounded-lg focus:outline-none transition duration-300 relative overflow-hidden"
                    style={{ 
                      background: theme.gradients.buttonGradient,
                      color: theme.colors.text.light
                    }}
                    whileHover={{ scale: 1.03, boxShadow: theme.shadows.button }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="absolute inset-0"
                      style={{ 
                        background: `linear-gradient(to right, ${theme.colors.accent.mint}, ${theme.colors.teal[500]})`,
                        opacity: 0 
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
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
                    
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <motion.span 
                            className="inline-block h-4 w-4 rounded-full bg-white opacity-75 mr-3"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                          />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </span>
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <p style={{ color: theme.colors.text.secondary }} className="text-sm">
                    Don't have an account?{' '}
                    <motion.a 
                      href="/signup" 
                      className="font-medium relative inline-block"
                      style={{ color: theme.colors.teal[500] }}
                      whileHover={{ color: theme.colors.teal[600] }}
                    >
                      <span>Sign up</span>
                      <motion.span 
                        className="absolute bottom-0 left-0 w-full h-0.5"
                        style={{ backgroundColor: theme.colors.teal[500] }}
                        initial={{ width: 0, left: "50%" }}
                        whileHover={{ width: "100%", left: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  </p>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div 
            className="w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Gradient background */}
            <motion.div 
              className="absolute inset-0 z-0"
              style={{ background: theme.gradients.cardBackground }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            
            <motion.div 
              className="relative z-10 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-6xl font-bold mb-6"
                  style={{ color: theme.colors.text.primary }}
                  initial={{ letterSpacing: "0.2em", opacity: 0.6 }}
                  animate={{ letterSpacing: "0.05em", opacity: 1 }}
                  transition={{ duration: 2, delay: 1.0, ease: "easeOut" }}
                >
                  <motion.span 
                    className="inline-block"
                    whileHover={{ 
                      scale: 1.1, 
                      color: theme.colors.teal[500],
                      textShadow: "0 0 15px rgba(65, 166, 178, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Elevate-
                  </motion.span>{" "}
                  <motion.span 
                    className="inline-block"
                    whileHover={{ 
                      scale: 1.1, 
                      color: theme.colors.accent.mint,
                      textShadow: "0 0 15px rgba(143, 211, 201, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Os
                  </motion.span>
                </motion.h1>
              </motion.div>
              
              <motion.p 
                className="text-xl mb-10 max-w-lg mx-auto leading-relaxed"
                style={{ color: theme.colors.text.secondary }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Empowering minds to shape the future through innovative thinking and collaborative problem-solving.
              </motion.p>
              
              <div className="space-y-6">
                {[
                  { text: "Real-time collaboration", delay: 1.4 },
                  { text: "Advanced analytics", delay: 1.6 },
                  { text: "Secure platform", delay: 1.8 }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    style={{ color: theme.colors.text.secondary }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${theme.colors.teal[500]}20` }}
                      whileHover={{ 
                        scale: 1.2, 
                        backgroundColor: `${theme.colors.teal[500]}30`,
                        boxShadow: "0 0 20px rgba(65, 166, 178, 0.3)"
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.svg 
                        className="w-6 h-6" 
                        style={{ color: theme.colors.teal[500] }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: item.delay + 0.3 }}
                      >
                        <motion.path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <span className="text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;