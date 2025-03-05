import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { useState } from 'react'; // Import the carousel component
import 'slick-carousel/slick/slick.css'; // Import slick CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick theme CSS

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true
  };



  return (
    <div className="min-h-screen">
      <section className="relative h-screen w-full overflow-hidden">
        <Slider {...settings}>
          {/* Hero Slide */}
          <div className="relative h-screen w-full overflow-hidden [&:has(.hover-trigger:hover)_.overlay]:opacity-100 [&:has(.hover-trigger:hover)]:has-overlay">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero-bg.webp")' }} />
            <div className="overlay absolute inset-0 transition-all duration-700 ease-in-out opacity-0 bg-black/60 backdrop-blur-sm z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary z-20">
              <div className="hover-trigger relative py-10 px-6 text-center hover:cursor-pointer">
                <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DAA520]">
                  Where AI Meets Interior Design
                </h1>
                <p className="relative z-10 text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto text-white font-light">Transform your space with our intelligent design assistant</p>
                <Link to="/upload" className="relative z-10 bg-[#DAA520] hover:bg-[#FFD700] text-primary px-10 py-4 text-lg md:text-xl rounded-lg transition-colors duration-200 font-bold text-white shadow-md hover:shadow-lg transform hover:scale-105">
                  Start Your Project
                </Link>
              </div>
            </div>
          </div>

          {/* Carousel Slide for GenerateLayout */}
          <div className="relative h-screen w-full overflow-hidden [&:has(.hover-trigger:hover)_.overlay]:opacity-100 [&:has(.hover-trigger:hover)]:has-overlay">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/generate-layout.jpg")' }} />
            <div className="overlay absolute inset-0 transition-all duration-700 ease-in-out opacity-0 bg-black/60 backdrop-blur-sm z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary z-20">
              <div className="hover-trigger relative py-10 px-6 text-center hover:cursor-pointer">
              <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DAA520]">
                Generate Your Layout
              </h1>
              <p className="relative z-10 text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto text-white font-light">Transform your space with our intelligent design assistant</p>
              <Link to="/generate-layout" className="relative z-10 bg-[#DAA520] hover:bg-[#FFD700] text-primary px-10 py-4 text-lg md:text-xl rounded-lg transition-colors duration-200 font-bold text-white shadow-md hover:shadow-lg transform hover:scale-105">
                Get Started
              </Link>
              </div>
            </div>
          </div>
        </Slider>
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
