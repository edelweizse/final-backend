import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { login, error, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault()
    login(email, password, navigate)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-4/5 md:w-1/4 text-center">
        <h1 className="text-white text-4xl font-semibold pb-4 border-b-2 border-white mb-8">
          Log In
        </h1>
        <form onSubmit={handleSignIn}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            className={`w-full py-4 bg-green-500 text-white uppercase rounded-lg hover:bg-green-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <Link to="/auth/register">
          <p className="text-green-500 hover:text-green-700 transition-colors mt-4">
            Don't have an account? Create one now!
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Login