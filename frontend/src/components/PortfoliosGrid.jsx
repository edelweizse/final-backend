import React from 'react'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const PortfoliosGrid = () => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const portfolios = [
    { id: 1, name: "Alice Johnson", title: "UX Designer", image: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Bob Smith", title: "Full Stack Developer", image: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Charlie Brown", title: "Graphic Designer", image: "/placeholder.svg?height=100&width=100" },
  ]

  const filteredPortfolios = portfolios.filter((portfolio) =>
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) || portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-row">
        <input
          type="text"
          placeholder="Search portfolios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black text-center mb-2">{portfolio.name}</h2>
            <p className="text-gray-700 text-center">{portfolio.title}</p>
            <Link
              className="bg-gray-900 w-auto flex mt-5 p-4 rounded-lg justify-center"
              to={`/portfolio/${portfolio.id}`}
            >
              <ExternalLink className="h-6 w-6 mx-2 text-white" />
              <p className="text-white">View Portfolio</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PortfoliosGrid
