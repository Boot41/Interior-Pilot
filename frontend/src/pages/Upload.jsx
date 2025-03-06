import { useState, useEffect, useRef } from 'react';
import { generateDesign, getDesignStyles } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadImage } from '../utils';
const Upload = () => {
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    floorPlanImage: null,
    roomType: 'living_room',
    areaSqft: 250,
    style: '1',
    colorScheme: 'Modern Minimalist',
    budgetLevel: 'Luxury',
    lightingPreference: 'Bright',
    additionalNotes: ''
  });

  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const data = await getDesignStyles();
        setStyles(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, style: data[0].id }));
      } catch (err) {
        setError('Failed to load design styles');
      }
    };
    fetchStyles();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, floorPlanImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.floorPlanImage) {
      setError('Please select a floor plan image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await generateDesign(formData);
      setGeneratedDesign(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8EF] via-[#F8F1E3] to-[#F5EAD7] py-24 px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#DAA520]/10 to-transparent"></div>
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#DAA520]/5 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-[#DAA520]/10 to-transparent"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center space-y-8 relative z-10"
      >
        <h1 className="text-6xl font-extrabold text-[#8B4513] leading-tight">
          Use Your Inspirations to Generate a Design
        </h1>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#DAA520] to-[#B8860B] rounded-full mt-6"></div>
        <p className="text-xl text-[#6B4423] font-light">Transform your space with AI-powered interior design.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-xl font-semibold text-[#8B4513] mb-4 relative">
                Upload Design
                <span className="text-red-500 absolute -top-1">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  mt-2 flex justify-center px-6 pt-5 pb-6 border-4 border-dashed 
                  rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                  ${dragActive 
                    ? 'border-[#DAA520] bg-[#DAA520]/5' 
                    : 'border-[#DAA520]/30 hover:border-[#DAA520] hover:bg-[#DAA520]/5'}
                `}
              >
                <div className="space-y-3 text-center">
                  {imagePreview ? (
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto h-64 w-auto object-contain rounded-lg" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <p className="text-white font-medium">Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      <svg 
                        className="mx-auto h-16 w-16 text-[#DAA520] animate-pulse" 
                        stroke="currentColor" 
                        fill="none" 
                        viewBox="0 0 48 48"
                      >
                        <path 
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                      <p className="mt-4 text-lg text-[#8B4513] font-medium">
                        Drop your design here
                      </p>
                      <p className="mt-2 text-sm text-[#6B4423]">
                        or click to select a file
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md mb-6"
                >
                  <p className="text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Room Type */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-[#8B4513]">Room Type</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-[#6B4423] bg-white border-[#DAA520]/30 focus:border-[#DAA520] focus:ring-[#DAA520]/50 rounded-lg shadow-sm"
              >
                <option value="living_room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
                <option value="dining_room">Dining Room</option>
                <option value="office">Office</option>
              </select>
            </div>

            {/* Style Selection */}
            <div className="grid grid-cols-2 gap-4">
              {styles.map(style => (
                <div
                  key={style.id}
                  onClick={() => setFormData(prev => ({ ...prev, style: style.id }))}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.style === style.id ? 'border-[#DAA520] bg-[#DAA520]/5' : 'border-[#DAA520]/20 hover:border-[#DAA520]/40'}`}
                >
                  <h3 className="font-medium text-[#8B4513]">{style.name}</h3>
                  <p className="text-sm text-[#6B4423]">{style.description}</p>
                </div>
              ))}
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-lg font-medium text-[#8B4513]">Color Scheme</label>
              <input
                type="text"
                value={formData.colorScheme}
                onChange={(e) => setFormData(prev => ({ ...prev, colorScheme: e.target.value }))}
                placeholder="e.g., Modern minimalist with earth tones"
                className="mt-1 block w-full border-[#DAA520]/30 rounded-lg shadow-sm focus:ring-[#DAA520]/50 focus:border-[#DAA520] py-3 px-4 text-[#6B4423]"
              />
            </div>

            {/* Budget Level */}
            <div className="grid grid-cols-3 gap-3">
              {['budget', 'mid_range', 'luxury'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, budgetLevel: level }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${formData.budgetLevel === level ? 'bg-[#DAA520] text-white shadow-md' : 'bg-white text-[#6B4423] border border-[#DAA520]/30 hover:border-[#DAA520]/60'}`}
                >
                  {level.replace('_', ' ').charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Lighting Preference */}
            <div className="grid grid-cols-3 gap-3">
              {['bright', 'moderate', 'dim'].map(light => (
                <button
                  key={light}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, lightingPreference: light }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${formData.lightingPreference === light ? 'bg-[#DAA520] text-white shadow-md' : 'bg-white text-[#6B4423] border border-[#DAA520]/30 hover:border-[#DAA520]/60'}`}
                >
                  {light.charAt(0).toUpperCase() + light.slice(1)}
                </button>
              ))}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-lg font-medium text-[#8B4513]">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                rows="3"
                placeholder="Any specific requirements or preferences..."
                className="mt-1 block w-full border-[#DAA520]/30 rounded-lg shadow-sm focus:ring-[#DAA520]/50 focus:border-[#DAA520] py-3 px-4 text-[#6B4423]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.floorPlanImage}
              className={`
                w-full py-4 rounded-lg text-white font-semibold text-lg
                transition-all duration-300
                ${loading || !formData.floorPlanImage
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#DAA520] hover:bg-[#B8860B] transform hover:scale-105'}
              `}
            >
              {loading ? 'Generating...' : 'Generate Design'}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
        >
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DAA520]"></div>
            </div>
          )}
          {!loading && generatedDesign && (
            <div className="relative group">
              <img 
                src={`http://localhost:8000/${generatedDesign.generated_image}`} 
                alt="Generated Design" 
                className="w-full rounded-lg shadow-lg"
              />
              <div 
                onClick={() => downloadImage(`http://localhost:8000/${generatedDesign.generated_image}`, 'interior-design.png')}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
              >
                <button className="bg-white px-4 py-2 rounded-lg text-[#8B4513] font-semibold">
                  Download Image
                </button>
              </div>
            </div>
          )}
          {!loading && !generatedDesign && (
            <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-[#DAA520]/30 rounded-xl">
              <svg 
                                className="w-16 h-16 text-[#DAA520]/40" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
              <p className="text-[#6B4423] font-medium">Your generated design will appear here</p>
              <p className="text-[#6B4423]/60 text-center text-sm">Upload an image and fill your preferences to generate a design</p>
              
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
