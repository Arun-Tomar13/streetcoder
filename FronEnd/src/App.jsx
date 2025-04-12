import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/dashboard'
import { ResumeCraft } from './pages/resumecraft'
import Portfolio from './pages/portfolio'
import Developer from './pages/developer'
import Elon from './pages/custom'
import VideoCallRecorder from './components/VideoCallRecorder'
import InterviewPrep from './pages/InterviewPrep'
import PathFinder from './pages/PathFinder'
import Growth from './pages/growth'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/resumecraft" element={<ResumeCraft />} />
        <Route path="/dashboard/pathfinder" element={<PathFinder />} />
        <Route path="/dashboard/growth" element={<Growth />} />
        {/* Resume Craft Portfolio Routes */}
        <Route path="/dashboard/resumecraft/portfolio" element={<Portfolio />} />
        <Route path="/dashboard/resumecraft/portfolio/:type" element={<Portfolio />} />
        <Route path="/dashboard/resumecraft/portfolio/developer/preview" element={<Developer />} />
        <Route path="/dashboard/resumecraft/portfolio/custom/preview" element={<Elon />} />
        {/* <Route path="/dashboard/resumecraft/cv" element={<CVUpload />} /> */}
        {/* Direct Portfolio Routes */}
        <Route path="/dashboard/portfolio" element={<Navigate to="/dashboard/resumecraft/portfolio" />} />
        <Route path="/dashboard/portfolio/:type" element={<Navigate to="/dashboard/resumecraft/portfolio/:type" replace />} />
        <Route path="/dashboard/portfolio/:type/preview" element={<Navigate to="/dashboard/resumecraft/portfolio/:type/preview" replace />} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/video-call" element={<VideoCallRecorder />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
      </Routes>
    </Router>
  )
}

export default App
