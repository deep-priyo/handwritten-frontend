import React, { useState } from 'react';

const HandwrittenDigitGenerator = () => {
    const [selectedDigit, setSelectedDigit] = useState('2');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateImages = async () => {
        setLoading(true);
        setError('');
        setGeneratedImages([]);

        try {
            // First, let's try using the batch endpoint which might be more efficient
            const response = await fetch('https://handwritten-digit-generation-web-app.onrender.com/api/generate_batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    digits: Array(5).fill(parseInt(selectedDigit))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate images');
            }

            // Convert batch response to the expected format
            const images = data.results.map((result, index) => ({
                id: index + 1,
                url: result.image,
                digit: result.digit
            }));

            setGeneratedImages(images);

        } catch (err) {
            setError(`Failed to generate images: ${err.message}`);
            console.error('Error generating images:', err);

            // For demo purposes, show placeholder images when API fails
            const placeholderImages = Array(5).fill(null).map((_, index) => ({
                id: index + 1,
                url: `data:image/svg+xml;base64,${btoa(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#000"/>
            <text x="50" y="50" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy="0.3em">${selectedDigit}</text>
          </svg>
        `)}`
            }));
            setGeneratedImages(placeholderImages);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Handwritten Digit Image Generator
                    </h1>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                        <p className="text-blue-800 text-sm">
                            <strong>Backend API:</strong>{' '}
                            <a
                                href="https://handwritten-digit-generation-web-app.onrender.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                https://handwritten-digit-generation-web-app.onrender.com
                            </a>
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <p className="text-yellow-800 text-sm">
                            ⏱️ <strong>Please wait up to 1 minute</strong> for the first request, as the backend is deployed on Render and may spin down due to inactivity.
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Generate synthetic MNIST-like images using your trained model.
                </p>

                {/* Form */}
                <div className="mb-8">
                    <div className="mb-4">
                        <label htmlFor="digit-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Choose a digit to generate (0-9):
                        </label>
                        <select
                            id="digit-select"
                            value={selectedDigit}
                            onChange={(e) => setSelectedDigit(e.target.value)}
                            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                                <option key={digit} value={digit}>{digit}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerateImages}
                        disabled={loading}
                        className={`px-6 py-2 rounded-md font-medium ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                        } text-white transition-colors`}
                    >
                        {loading ? 'Generating...' : 'Generate Images'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700">{error}</p>
                        <p className="text-sm text-red-600 mt-1">
                            Showing placeholder images for demonstration.
                        </p>
                    </div>
                )}

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Generated images of digit {selectedDigit}
                        </h2>
                        <div className="grid grid-cols-5 gap-6">
                            {generatedImages.map((image, index) => (
                                <div key={image.id || index} className="text-center">
                                    <div className="w-24 h-24 mx-auto bg-black rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={image.url}
                                            alt={`Generated digit ${selectedDigit} sample ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to SVG if image fails to load
                                                e.target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
                            <rect width="96" height="96" fill="#000"/>
                            <text x="48" y="48" font-family="Arial" font-size="36" fill="white" text-anchor="middle" dy="0.3em">${selectedDigit}</text>
                          </svg>
                        `)}`;
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Sample {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && generatedImages.length === 0 && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mr-3"></div>
                            <span className="text-gray-600">Generating images... This may take up to 1 minute if the backend is starting up.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HandwrittenDigitGenerator;