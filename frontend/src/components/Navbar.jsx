import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState('');
  const { logout, user } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const profileDropdown = [
    { name: 'My Profile', href: `/profile/${user.id}`, icon: User },
    { name: 'My Portfolio', href: portfolioLink, icon: Briefcase },
    { name: 'Logout', href: '#', icon: LogOut, action: logout },
  ];

  useEffect(() => {
    if (user?.id) {
      const fetchPortfolioLink = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/portfolio/user/${user.id}`);
          setPortfolioLink(`/portfolio/${res.data.id}`);
        } catch (err) {
          console.error('Error fetching portfolio link:', err);
        }
      };

      fetchPortfolioLink();
    }
  }, [user]);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-2xl font-semibold">
              Portfolio
            </a>
          </div>
          <div className="hidden md:flex space-x-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {profileDropdown.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={item.action}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={item.action}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
