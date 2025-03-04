// src/pages/GenerateLayout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenerateLayout = () => {
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [generatedImages, setGeneratedImages] = useState([]);

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

            if (response.data.images) {
                setGeneratedImages(response.data.images);
            } else if (response.data.image) {
                setGeneratedImages([response.data.image]);
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
            <div className="mt-4">
                {generatedImages.map((img, index) => (
                    <img key={index} src={img} alt={`Generated Layout ${index + 1}`} className="w-full h-auto" />
                ))}
            </div>
        </div>
    );
};

export default GenerateLayout;