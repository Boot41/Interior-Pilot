import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const GenerateLayout = () => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [generatedImages, setGeneratedImages] = useState(null); // Initialize as null
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setGeneratedImages(null); // Reset generated images when new image is uploaded
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', image);

            const uploadResponse = await axios.post('http://localhost:8000/api/upload-image/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = uploadResponse.data.url;

            const response = await axios.post('http://localhost:8000/api/generate-3d-layout/', {
                image: imageUrl,
                prompt: prompt,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.image_urls) {
                setGeneratedImages(response.data.image_urls);
            }
            setMessage(response.data.message || 'Layout generated successfully!');
        } catch (error) {
            console.error(error);
            setError('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF8EF] via-[#F8F1E3] to-[#F5EAD7] py-24 px-8 relative overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto text-center space-y-8 relative z-10"
            >
                <h1 className="text-6xl font-extrabold text-[#8B4513] leading-tight">
                    Generate Your Layout
                </h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#DAA520] to-[#B8860B] rounded-full mt-6"></div>
                <p className="text-xl text-[#6B4423] font-light">Transform your space with AI-powered layouts.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
                {/* Upload Image Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xl font-semibold text-[#8B4513] mb-4 relative">
                                Upload Image
                                <span className="text-red-500 absolute -top-1">*</span>
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    mt-2 flex justify-center px-6 pt-5 pb-6 border-4 border-dashed 
                                    rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                                    ${imagePreview 
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
                                                Drop your image here
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
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-[#8B4513]">Prompt</label>
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)} 
                                required 
                                className="w-full h-24 p-2 border border-gray-300 rounded" 
                                placeholder="Describe how you want to transform your space..."
                            />
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

                        <button
                            type="submit"
                            disabled={loading || !image}
                            className={`
                                w-full py-4 rounded-lg text-white font-semibold text-lg
                                transition-all duration-300
                                ${loading || !image
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#DAA520] hover:bg-[#B8860B] transform hover:scale-105'}
                            `}
                        >
                            {loading ? 'Generating...' : 'Generate Layout'}
                        </button>
                    </form>
                </motion.div>

                {/* Generated Image Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
                >
                    {!generatedImages && !loading && (
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
                            <p className="text-[#6B4423]/60 text-center text-sm">Upload an image and prompt to generate a layout</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DAA520]"></div>
                        </div>
                    )}

                    {generatedImages && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <h2 className="text-2xl font-bold text-[#8B4513]">Generated Layout</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-[#DAA520]/40 to-transparent"></div>
                            </div>
                            {generatedImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Generated Layout ${index + 1}`}
                                    className="w-full h-auto rounded-lg shadow-lg"
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GenerateLayout;
