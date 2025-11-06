import { Link } from 'react-router-dom';
import { Shield, Upload, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import Background from '../assets/background.png';

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-center">
        {/* Background Layers */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: `url(${Background})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900" />
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 py-32 my-auto flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Detect Deepfakes with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Advanced AI</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            DeepFakeGuard uses cutting-edge AI to identify manipulated media with high accuracy. Protect yourself from digital fraud and misinformation.
          </p>
          <div className="mt-10 ">
            <Link to="/upload">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 cursor-pointer hover:to-purple-800 font-semibold shadow-lg">
                <Upload size={20} className="-2" />
                Upload Media to Analyze
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Simplified Features & CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">A Simple, Powerful Solution</h2>
          <p className="text-white/70 mb-16 max-w-2xl mx-auto">
            Our platform is built for speed and accuracy. Get clear results in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <Upload size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Media</h3>
              <p className="text-white/60">
                Securely upload any image or video file for analysis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <Shield size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-white/60">
                Our models scan for manipulation artifacts and inconsistencies.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Clear Results</h3>
              <p className="text-white/60">
                Receive a straightforward report with a confidence score.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;