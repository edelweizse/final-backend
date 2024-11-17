import React from 'react'
import Navbar from './Navbar'
import PortfoliosGrid from './PortfoliosGrid'

const Main = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <PortfoliosGrid />
    </div>
  )
}

export default Main
