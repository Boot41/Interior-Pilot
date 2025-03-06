import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadImage } from '../utils';
const RoomDesign = () => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        theme: '',
        room_type: '',
        color: '',
        accessories: '',
        furniture: '',
        walls: '',
        lights: '',
        realistic: ''
    });

    // Predefined options for cards
    const options = {
        theme: ['Modern', 'Marvel', 'Disney', 'Minimalist', 'Vintage', 'Industrial', 'Bohemian', 'Contemporary'],
        room_type: ['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Office', 'Playroom', 'Study Room', 'Gaming Room'],
        color: ['Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'White', 'Black', 'Gold', 'Silver'],
        accessories: ['Stars', 'Plants', 'Art Pieces', 'Mirrors', 'Cushions', 'Rugs', 'Wall Art', 'Decorative Items'],
        walls: ['Pastel', 'Bold', 'Neutral', 'Textured', 'Wallpapered', 'Painted', 'Wood Paneled', 'Brick'],
        lights: ['Fairy', 'Chandelier', 'LED Strips', 'Pendant', 'Spotlights', 'Floor Lamps', 'Wall Sconces', 'Natural'],
        realistic: ['Magical', 'Realistic', 'Dreamy', 'Artistic', 'Futuristic', 'Cozy', 'Elegant', 'Playful']
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setGeneratedImage(null);
        }
    };

    const handleOptionSelect = (category, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleFurnitureChange = (e) => {
        setFormData(prev => ({
            ...prev,
            furniture: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError(null);

        try {
            // First upload the image
            const imageFormData = new FormData();
            imageFormData.append('image', image);

            const uploadResponse = await axios.post('http://localhost:8000/api/upload-image/', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = uploadResponse.data.url;

            // Then generate the room design
            const response = await axios.post('http://localhost:8000/api/room-design/', {
                ...formData,
                image: imageUrl
            });

            if (response.data.url) {
                setGeneratedImage(response.data.url);
            }
            setMessage(response.data.message || 'Room design generated successfully!');
        } catch (error) {
            console.error(error);
            setError('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        } finally {
            setLoading(false);
        }
    };

    const renderOptionCards = (category) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {options[category].map((option) => (
                <div
                    key={option}
                    onClick={() => handleOptionSelect(category, option.toLowerCase())}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData[category] === option.toLowerCase()
                            ? 'bg-[#DAA520] text-white'
                            : 'bg-white hover:bg-[#DAA520]/10'
                    }`}
                >
                    {option}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF8EF] via-[#F8F1E3] to-[#F5EAD7] py-24 px-8 relative overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto text-center space-y-8 relative z-10"
            >
                <h1 className="text-6xl font-extrabold text-[#8B4513] leading-tight">
                    Design Your Room
                </h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#DAA520] to-[#B8860B] rounded-full mt-6"></div>
                <p className="text-xl text-[#6B4423] font-light">Transform your space with AI-powered room design.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
                {/* Upload and Options Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-8"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xl font-semibold text-[#8B4513] mb-4 relative">
                                    Upload Room Image
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
                                                    className="max-h-64 rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-white">Click to change image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-[#DAA520]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-[#8B4513]">Click to upload an image</p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Theme</label>
                                {renderOptionCards('theme')}
                            </div>

                            {/* Room Type Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Room Type</label>
                                {renderOptionCards('room_type')}
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Color Scheme</label>
                                {renderOptionCards('color')}
                            </div>

                            {/* Furniture Input */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Furniture</label>
                                <textarea
                                    value={formData.furniture}
                                    onChange={handleFurnitureChange}
                                    placeholder="Describe the furniture you want (e.g., car shaped bed, chair, bed table)"
                                    className="w-full p-4 border border-[#DAA520]/30 rounded-lg focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none"
                                    rows="3"
                                />
                            </div>

                            {/* Accessories Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Accessories</label>
                                {renderOptionCards('accessories')}
                            </div>

                            {/* Walls Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Wall Style</label>
                                {renderOptionCards('walls')}
                            </div>

                            {/* Lights Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Lighting</label>
                                {renderOptionCards('lights')}
                            </div>

                            {/* Style Selection */}
                            <div className="space-y-4">
                                <label className="block text-xl font-semibold text-[#8B4513]">Style</label>
                                {renderOptionCards('realistic')}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !image || !formData.theme}
                                className={`
                                    w-full py-4 rounded-lg text-white font-semibold text-lg
                                    transition-all duration-300
                                    ${loading || !image || !formData.theme
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#DAA520] hover:bg-[#B8860B] transform hover:scale-105'}
                                `}
                            >
                                {loading ? 'Generating...' : 'Generate Design'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
                >
                    <div className="space-y-8">
                        <h2 className="text-2xl font-semibold text-[#8B4513]">Generated Design</h2>
                        
                        {error && (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {message && !error && (
                            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                                {message}
                            </div>
                        )}

                        {generatedImage && (
                            <div className="relative group">
                            <img 
                                src={generatedImage} 
                                alt="Generated Design"
                                className="w-full rounded-lg shadow-lg"
                            />
                            <a 
                            href={generatedImage}
                            download
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                        >
                            <button className="bg-white px-4 py-2 rounded-lg text-[#8B4513] font-semibold">
                                Download Image
                            </button>
                        </a>
                        </div>
                        )}

                        {!generatedImage && !loading && (
                            <div className="flex items-center justify-center h-64 border-4 border-dashed border-[#DAA520]/30 rounded-xl">
                                <div className="flex flex-col items-center justify-center">
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
                            </div>
                        )}

                        {loading && (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DAA520]"></div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RoomDesign;
