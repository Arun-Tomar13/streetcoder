import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/solid';

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    githubProfile: '',
    linkedinProfile: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
      
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Signup successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(20, 184, 166, 0.6)' },
    tap: { scale: 0.95 }
  };

  const gradientVariants = {
    animate: {
      background: [
        'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))',
        'linear-gradient(225deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))',
        'linear-gradient(315deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))',
        'linear-gradient(45deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))',
        'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))'
      ],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: 'mirror'
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 overflow-hidden">
      {/* Left side - Signup Form */}
      <motion.div 
        className="w-1/2 flex items-center justify-center p-8"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md">
          <motion.div 
            className="mb-8 flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mr-3">
              <LightBulbIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 mb-2">CareerCompass</h2>
              <p className="text-gray-600 text-base">Create your account to get started</p>
            </div>
          </motion.div>
          
          <motion.form 
            className="space-y-5 bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100"
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                whileHover={{ y: -2 }}
                onFocus={() => setCurrentField('email')}
                onBlur={() => setCurrentField(null)}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-white border ${currentField === 'email' ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition duration-300`}
                  placeholder="Enter your email"
                />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                whileHover={{ y: -2 }}
                onFocus={() => setCurrentField('password')}
                onBlur={() => setCurrentField(null)}
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-white border ${currentField === 'password' ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition duration-300`}
                  placeholder="Enter your password"
                />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700 mb-1.5">
                GitHub Profile URL (Optional)
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                whileHover={{ y: -2 }}
                onFocus={() => setCurrentField('githubProfile')}
                onBlur={() => setCurrentField(null)}
              >
                <input
                  id="githubProfile"
                  name="githubProfile"
                  type="url"
                  value={formData.githubProfile}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-white border ${currentField === 'githubProfile' ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition duration-300`}
                  placeholder="https://github.com/username"
                />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-1.5">
                LinkedIn Profile URL (Optional)
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                whileHover={{ y: -2 }}
                onFocus={() => setCurrentField('linkedinProfile')}
                onBlur={() => setCurrentField(null)}
              >
                <input
                  id="linkedinProfile"
                  name="linkedinProfile"
                  type="url"
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-white border ${currentField === 'linkedinProfile' ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition duration-300`}
                  placeholder="https://linkedin.com/in/username"
                />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg focus:outline-none transition duration-200 relative overflow-hidden group"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span 
                  className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                {loading ? (
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </motion.div>
                ) : 'Sign Up'}
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="text-center mt-4"
              variants={itemVariants}
            >
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <motion.a 
                  href="/login" 
                  className="text-teal-600 hover:text-teal-500 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log in
                </motion.a>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right side - Content */}
      <motion.div 
        className="w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-pink-500 z-0 opacity-90"
          variants={gradientVariants}
          animate="animate"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: ['-100%', '200%'],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        
        {/* Content card with glass effect */}
        <motion.div 
          className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white border-opacity-20 max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Career Companion
          </motion.h1>
          <motion.p 
            className="text-lg text-white mb-8 opacity-90"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            Your AI-powered guide to find your path, sharpen your skills, and grow with confidence.
          </motion.p>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 1.2, staggerChildren: 0.2 }}
          >
            <motion.div 
              className="flex items-center space-x-3 text-white"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <span className="text-base">Personalized career paths</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3 text-white"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <span className="text-base">AI-driven skill enhancement</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3 text-white"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <span className="text-base">Connect with mentors & peers</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 pt-6 border-t border-white border-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <p className="text-white text-sm opacity-80 italic">
              "CareerCompass helped me identify my strengths and guided me toward a career path I never would have considered on my own."
            </p>
            <div className="mt-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-medium text-sm">MJ</div>
              <div className="ml-2">
                <p className="text-white text-sm font-medium">Maria Johnson</p>
                <p className="text-white text-xs opacity-70">Product Manager at TechCorp</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup; 