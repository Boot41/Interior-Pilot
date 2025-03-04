const Process = () => {
  return (
    <div className="pt-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Our Process</h1>
          <div className="space-y-20">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
                <h3 className="text-2xl font-bold mb-4">Upload Your Space</h3>
                <p className="text-gray-600">
                  Share your floor plan or room photos with our AI system. The more
                  details you provide, the better we can understand your space and
                  requirements.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/images/process-1.jpg"
                  alt="Upload Process"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
                <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
                <p className="text-gray-600">
                  Our advanced AI algorithms analyze your space, considering factors
                  like dimensions, lighting, traffic flow, and existing elements to
                  create optimal design solutions.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/images/process-2.jpg"
                  alt="AI Analysis"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
                <h3 className="text-2xl font-bold mb-4">Design Generation</h3>
                <p className="text-gray-600">
                  Based on the analysis, we generate multiple design options that
                  match your style preferences and functional requirements.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/images/process-3.jpg"
                  alt="Design Generation"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">4</div>
                <h3 className="text-2xl font-bold mb-4">Visualization</h3>
                <p className="text-gray-600">
                  Experience your new space in 3D with our virtual staging
                  technology. Make adjustments and see the changes in real-time.
                </p>
              </div>
              <div className="flex-1">
                <img
                  src="/images/process-4.jpg"
                  alt="Visualization"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
