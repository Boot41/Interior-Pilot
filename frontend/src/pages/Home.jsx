import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F1C376]">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero-bg.webp")' }} />
        <div className="absolute inset-0 bg-primary bg-opacity-50 z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary z-20">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DAA520]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Where AI Meets Interior Design
          </motion.h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white">Transform your space with our intelligent design assistant</p>
          <Link to="/upload" className="bg-[#DAA520] hover:bg-[#FFD700] text-primary px-8 py-3 rounded-lg transition-colors duration-200 font-bold text-white shadow-md hover:shadow-lg transform hover:scale-105" style={{ padding: '15px 40px' }}>
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F5EAD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#8B4513]">Our Services</h2>
          <p className="text-lg md:text-xl text-[#DAA520] text-center mb-12">Experience the future of interior design with our AI-powered solutions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#F1C376] p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#DAA520]/20">
              <img src="/images/feature-1.avif" alt="AI Design" className="w-full h-48 object-cover mb-4 rounded-xl" />
              <h3 className="text-xl font-bold mb-2 text-[#8B4513]">AI-Powered Design</h3>
              <p className="text-[#6B4423]">Get instant design suggestions based on your space and preferences</p>
            </div>
            <div className="bg-[#F1C376] p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#DAA520]/20">
              <img src="/images/feature-2.jpg" alt="Virtual Staging" className="w-full h-48 object-cover mb-4 rounded-xl" />
              <h3 className="text-xl font-bold mb-2 text-[#8B4513]">Layout Generation</h3>
              <p className="text-[#6B4423]">Visualize your Floorplan with 3D layouts, furniture and decor options</p>
            </div>
            <div className="bg-[#F1C376] p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#DAA520]/20">
              <img src="/images/feature-4.jpg" alt="3D Visualization" className="w-full h-48 object-cover mb-4 rounded-xl" />
              <h3 className="text-xl font-bold mb-2 text-[#8B4513]">3D Visualization</h3>
              <p className="text-[#6B4423]">See your designs come to life with realistic 3D models</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;