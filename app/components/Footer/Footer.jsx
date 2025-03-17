import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'FronEnd', url: 'https://github.com/artiito1/votedao' },
    { name: 'SmartContract', url: 'https://github.com/artiito1/Voting_system' },
    { name: 'WhitePaper', url: '/' },
  ];

  const footerLinks = [
    { name: 'About', url: '/about' },
    { name: 'Instagram', url: '/terms' },
    { name: 'Privacy Policy', url: '/privacy'},
  ];

  return (
    <footer className="border-t border-gray-400/30 mt-auto ">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Image src={logo} alt="VoterDao Logo" width={160} height={50} />
            <p className="mt-4 text-sm text-gray-400">
              Decentralized voting platform for the future
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-semibold mb-4">Source Code</h3>
            <div className="flex space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 ">
          <div className='border-t border-gray-400/30'>
            <p className="text-center text-gray-400 text-sm py-4 mt-0">
                © {currentYear} VoterDao. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};