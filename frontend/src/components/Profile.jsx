import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { QRCodeSVG } from 'qrcode.react';

const toggle2FA = async (enable) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        qrCode: 'otpauth://totp/MyApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
        secret: 'JBSWY3DPEHPK3PXP',
      });
    }, 1000);
  });
};

const Profile = () => {
  

  const { id } = useParams();
  const [portfolio, setPortfolio] = useState({
    id: id,
    name: "Jane Doe",
    title: "Full Stack Developer",
    description:
      "Passionate full stack developer with 5 years of experience in building scalable web applications. Proficient in React, Node.js, and PostgreSQL. Always eager to learn new technologies and solve complex problems.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQRCode] = useState('');
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prevPortfolio) => ({ ...prevPortfolio, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated portfolio data:', portfolio);
  };

  const handle2FAToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggle2FA(!is2FAEnabled);
      setIs2FAEnabled(!is2FAEnabled);
      if (!is2FAEnabled) {
        setQRCode(result.qrCode);
        setSecret(result.secret);
      } else {
        setQRCode('');
        setSecret('');
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">Title</label>
              <input
                id="title"
                name="title"
                value={portfolio.title}
                onChange={handleInputChange}
                className="w-full p-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                value={portfolio.description}
                onChange={handleInputChange}
                className="w-full p-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium">Skills (comma-separated)</label>
              <input
                id="skills"
                name="skills"
                value={portfolio.skills.join(', ')}
                onChange={(e) => handleInputChange({ target: { name: 'skills', value: e.target.value.split(', ') } })}
                className="w-full p-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Save Changes
            </button>
          </form>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handle2FAToggle}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400"
            >
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
            {isLoading && <p className="text-gray-400">Loading...</p>}
          </div>
          {is2FAEnabled && qrCode && (
            <div className="mt-4">
              <p>Scan this QR code with your authenticator app:</p>
              <div className="flex justify-center">
                <QRCodeSVG value={qrCode} size={256} />
              </div>
              <p>Or enter this code manually:</p>
              <code className="block bg-gray-800 text-white p-2 rounded-md">{secret}</code>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
