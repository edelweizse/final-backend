import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './Navbar'

const Portfolio = () => {
  const { id } = useParams()

  const portfolio = {
    id: id,
    name: "Jane Doe",
    title: "Full Stack Developer",
    description:
      "Passionate full stack developer with 5 years of experience in building scalable web applications. Proficient in React, Node.js, and PostgreSQL. Always eager to learn new technologies and solve complex problems.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    images: [
      "https://placehold.co/600x400",
      "https://placehold.co/600x400",
      "https://placehold.co/600x400 ",
    ],
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe",
  }

  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="bg-gray-900 h-screen text-gray-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8 my-28">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img
                src={portfolio.images[currentSlide]}
                alt={`Project ${currentSlide + 1}`}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-gray-200 p-2 rounded-full hover:bg-gray-600"
                onClick={() =>
                  setCurrentSlide((currentSlide - 1 + portfolio.images.length) % portfolio.images.length)
                }
              >
                ❮
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-gray-200 p-2 rounded-full hover:bg-gray-600"
                onClick={() =>
                  setCurrentSlide((currentSlide + 1) % portfolio.images.length)
                }
              >
                ❯
              </button>
            </div>
            <div className="flex justify-center mt-4">
              {portfolio.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    index === currentSlide
                      ? "bg-green-500"
                      : "bg-gray-500 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold text-white mb-2">{portfolio.name}</h1>
            <h2 className="text-2xl text-gray-400 mb-4">{portfolio.title}</h2>
            <p className="mb-6 text-gray-300">{portfolio.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href={portfolio.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
              >
                GitHub
              </a>
              <a
                href={portfolio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
