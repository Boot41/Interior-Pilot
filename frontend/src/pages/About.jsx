const About = () => {
  return (
    <div className="pt-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600 mb-6">
                At Interior Pilot, we envision a future where creating your dream
                space is as simple as having a conversation. By combining cutting-edge
                AI technology with interior design principles, we're making
                professional design accessible to everyone.
              </p>
              <p className="text-gray-600">
                Our mission is to revolutionize the interior design industry by
                providing intelligent, automated solutions that understand and adapt
                to each individual's unique style and needs.
              </p>
            </div>
            <div>
              <img
                src="/images/about-vision.jpg"
                alt="Our Vision"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="order-2 md:order-1">
              <img
                src="/images/about-technology.jpg"
                alt="Our Technology"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
              <p className="text-gray-600 mb-6">
                We leverage state-of-the-art artificial intelligence and machine
                learning algorithms to analyze spaces, understand design patterns,
                and generate personalized recommendations that perfectly match your
                style and requirements.
              </p>
              <p className="text-gray-600">
                Our AI system continuously learns and evolves, staying up-to-date
                with the latest design trends and innovations to provide you with
                the best possible solutions.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Why Choose Interior Pilot?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card">
                <h3 className="text-xl font-bold mb-3">AI-Powered Innovation</h3>
                <p className="text-gray-600">
                  Advanced technology that understands your unique style and preferences
                </p>
              </div>
              <div className="feature-card">
                <h3 className="text-xl font-bold mb-3">Time & Cost Efficient</h3>
                <p className="text-gray-600">
                  Get professional design solutions in minutes, not weeks
                </p>
              </div>
              <div className="feature-card">
                <h3 className="text-xl font-bold mb-3">Personalized Experience</h3>
                <p className="text-gray-600">
                  Tailored recommendations that match your specific needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
