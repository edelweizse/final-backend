import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import MFA from './components/MFA'
import Main from './components/Main'
import Portfolio from './components/Portfolio'
import Profile from './components/Profile'
import { useAuthStore } from './stores/authStore'

function App() {

  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/mfa" element={<MFA userId={useAuthStore.getState()}/>} />
      <Route path="/" element={<Main />} />
      <Route path="/portfolio/:id" element={<Portfolio />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  )
}

export default App
