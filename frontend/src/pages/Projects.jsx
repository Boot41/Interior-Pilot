const Projects = () => {
  return (
    <div className="pt-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Our Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project cards will go here */}
            <div className="bg-white shadow-lg">
              <img
                src="/images/project-1.jpg"
                alt="Modern Living Room"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Modern Living Room</h3>
                <p className="text-gray-600 mb-4">
                  A contemporary living space designed with AI assistance
                </p>
                <button className="text-black font-semibold hover:underline">
                  View Details
                </button>
              </div>
            </div>
            {/* Add more project cards as needed */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
