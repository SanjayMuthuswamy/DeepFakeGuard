import React from 'react';
import { Shield, Cpu, Lock } from 'lucide-react';

// Helper component for the principles
const Principle = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-violet-400">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-white/70">{description}</p>
  </div>
);


const AboutPage = () => {
  return (
    <div className="bg-gray-900 text-white ">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:py-26 text-center">

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DeepFakeGuard</span>
        </h1>
        
        {/* Mission Statement */}
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
          Our mission is to fight misinformation by making deepfake detection simple, accurate, and accessible to everyone. We believe in a more trustworthy digital world.
        </p>

        {/* Divider */}
        <div className="mt-16 mb-16 h-px w-20  mx-auto" />

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Principle
            icon={<Cpu size={28} />}
            title="Advanced Technology"
            description="We use powerful AI to find manipulation with high accuracy."
          />
          <Principle
            icon={<Shield size={28} />}
            title="Simple for Everyone"
            description="Our tools are designed to be fast, clear, and easy for anyone to use."
          />
          <Principle
            icon={<Lock size={28} />}
            title="Private & Secure"
            description="Your files are always processed securely and are never stored."
          />
        </div>

      </div>
    </div>
  );
};

export default AboutPage;