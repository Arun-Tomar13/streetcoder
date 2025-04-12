import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import VideoCallRecorder from './components/VideoCallRecorder'
import InterviewPrep from './pages/InterviewPrep'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-call" element={<VideoCallRecorder />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
      </Routes>
    </Router>
  )
}

export default App
