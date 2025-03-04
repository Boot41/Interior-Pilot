import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero-bg.webp")' }} />
        <div className="absolute inset-0 bg-primary bg-opacity-50 z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Where AI Meets Interior Design</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white">Transform your space with our intelligent design assistant</p>
          <Link to="/upload" className="bg-golden hover:bg-golden-dark text-primary px-8 py-3 rounded-none transition-colors duration-200 font-semibold text-white">
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">Our Services</h2>
          <p className="text-lg md:text-xl text-golden-dark text-center mb-12">Experience the future of interior design with our AI-powered solutions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-golden/20">
              <img src="/images/feature-1.jpg" alt="AI Design" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold mb-2 text-golden">AI-Powered Design</h3>
              <p className="text-primary/80">Get instant design suggestions based on your space and preferences</p>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-golden/20">
              <img src="/images/feature-2.jpg" alt="Virtual Staging" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold mb-2 text-golden">Virtual Staging</h3>
              <p className="text-primary/80">Visualize your space with different furniture and decor options</p>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-golden/20">
              <img src="/images/feature-3.jpg" alt="Smart Layout" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Layout Planning</h3>
              <p className="text-gray-600">Optimize your space with AI-generated layout recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-600">Share your floor plan or room photos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-gray-600">Our AI analyzes your space and requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Design</h3>
              <p className="text-gray-600">Get personalized design recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold mb-2">Visualize</h3>
              <p className="text-gray-600">See your space transformed in 3D</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start your journey with Interior Pilot today</p>
          <div className="flex justify-center space-x-4">
            <Link to="/upload" className="bg-white text-black px-8 py-3 rounded-none hover:bg-gray-800 transition-colors duration-200">Start Project</Link>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-none hover:bg-white hover:text-black transition-colors duration-200">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;