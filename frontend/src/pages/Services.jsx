const Services = () => {
  return (
    <div className="pt-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="feature-card">
              <h3 className="text-2xl font-bold mb-4">AI-Powered Design</h3>
              <p className="text-gray-600 mb-6">
                Our advanced AI algorithms analyze your space and preferences to create
                personalized design recommendations that perfectly match your style and
                requirements.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li>• Instant design suggestions</li>
                <li>• Style matching</li>
                <li>• Color palette recommendations</li>
                <li>• Furniture placement optimization</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3 className="text-2xl font-bold mb-4">Virtual Staging</h3>
              <p className="text-gray-600 mb-6">
                Experience your space before making any changes with our cutting-edge
                virtual staging technology.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li>• 3D visualization</li>
                <li>• Multiple design variations</li>
                <li>• Real-time modifications</li>
                <li>• Accurate measurements</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3 className="text-2xl font-bold mb-4">Smart Layout Planning</h3>
              <p className="text-gray-600 mb-6">
                Optimize your space utilization with AI-generated layout recommendations
                that consider both functionality and aesthetics.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li>• Space optimization</li>
                <li>• Traffic flow analysis</li>
                <li>• Furniture arrangement</li>
                <li>• Accessibility considerations</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3 className="text-2xl font-bold mb-4">Design Consultation</h3>
              <p className="text-gray-600 mb-6">
                Get expert advice from our AI system combined with professional
                interior designers for the perfect blend of technology and human expertise.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li>• Personalized recommendations</li>
                <li>• Material selection</li>
                <li>• Budget planning</li>
                <li>• Project timeline</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
