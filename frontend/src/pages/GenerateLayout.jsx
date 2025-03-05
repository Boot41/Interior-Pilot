// src/pages/GenerateLayout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const GenerateLayout = () => {
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [generatedImages, setGeneratedImages] = useState();

    const navigate = useNavigate();

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            // First, upload the image to get the public URL
            const formData = new FormData();
            formData.append('image', image);

            const uploadResponse = await axios.post('http://localhost:8000/api/upload-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!uploadResponse.data.url) {
                throw new Error('Failed to get image URL from upload');
            }

            const imageUrl = uploadResponse.data.url;

            // Now use the public URL to generate the 3D layout
            const response = await axios.post('http://localhost:8000/api/generate-3d-layout/', {
                image: imageUrl,
                prompt: prompt,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            if (response.data.image_urls) {
                setGeneratedImages(response.data.image_urls); // Set to the array of URLs
            }
            setMessage(response.data.message || 'Layout generated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Generate 3D Layout</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Upload Image:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        required 
                        className="w-full p-2 border border-gray-300 rounded" 
                    />
                </div>
                <div>
                    <label className="block mb-2">Prompt:</label>
                    <textarea 
                        value={prompt} 
                        onChange={handlePromptChange} 
                        required 
                        className="w-full h-24 p-2 border border-gray-300 rounded" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-[#DAA520] text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Generate Layout'}
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(218,165,32,0.1)] p-8 border border-[#DAA520]/20"
>
    {generatedImages ? (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-2xl font-bold text-[#8B4513]">Generated 3D Layout</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#DAA520]/40 to-transparent"></div>
            </div>
            <img
                src={generatedImages[0]}
                alt="Generated 3D Layout"
                className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="mt-4 space-y-2">
                <h3 className="text-lg font-medium text-[#8B4513]">Layout Details</h3>
                <p className="text-[#6B4423]">{prompt}</p>
                {/* Add any other relevant details about the layout here */}
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center h-full">
            <p className="text-[#6B4423] text-center">
                Your generated layout will appear here
            </p>
        </div>
    )}
</motion.div>
        </div>
    );
};

{/* <a href={`http://localhost:8000/${generatedImages}`} target="_blank" rel="noopener noreferrer">
                                    View Generated Layout
                                </a> */}

export default GenerateLayout;