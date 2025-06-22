import React, { useState } from 'react';

const HandwrittenDigitGenerator = () => {
    const [selectedDigit, setSelectedDigit] = useState('2');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateImages = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    digit: parseInt(selectedDigit),
                    count: 5 // Generate 5 samples
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Assuming the API returns an array of base64 encoded images
            // or URLs to the generated images
            setGeneratedImages(data.images || []);

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

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        },
        wrapper: {
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '0 1rem'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
        },
        headerButtons: {
            display: 'flex',
            gap: '0.5rem'
        },
        headerButton: {
            padding: '0.5rem',
            color: '#4b5563',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s'
        },
        description: {
            color: '#4b5563',
            marginBottom: '2rem',
            fontSize: '1rem'
        },
        form: {
            marginBottom: '2rem'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
        },
        select: {
            display: 'block',
            width: '12rem',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
        },
        button: {
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontSize: '1rem'
        },
        buttonActive: {
            backgroundColor: '#ef4444'
        },
        buttonHover: {
            backgroundColor: '#dc2626'
        },
        buttonDisabled: {
            backgroundColor: '#9ca3af',
            cursor: 'not-allowed'
        },
        errorContainer: {
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem'
        },
        errorText: {
            color: '#b91c1c',
            margin: 0
        },
        errorSubtext: {
            fontSize: '0.875rem',
            color: '#dc2626',
            marginTop: '0.25rem',
            margin: '0.25rem 0 0 0'
        },
        resultsTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
        },
        imageGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem'
        },
        imageItem: {
            textAlign: 'center'
        },
        imageContainer: {
            width: '6rem',
            height: '6rem',
            margin: '0 auto',
            backgroundColor: '#000',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        imageLabel: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem'
        },
        loadingContainer: {
            textAlign: 'center',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        },
        loadingContent: {
            display: 'inline-flex',
            alignItems: 'center'
        },
        spinner: {
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid transparent',
            borderBottom: '2px solid #ef4444',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '0.75rem'
        },
        loadingText: {
            color: '#4b5563'
        }
    };

    // Add CSS animation for spinner
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;
    if (!document.head.querySelector('style[data-spinner]')) {
        spinnerStyle.setAttribute('data-spinner', 'true');
        document.head.appendChild(spinnerStyle);
    }

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Handwritten Digit Image Generator
                    </h1>
                    <div style={styles.headerButtons}>
                        <button
                            style={styles.headerButton}
                            onMouseOver={(e) => e.target.style.color = '#1f2937'}
                            onMouseOut={(e) => e.target.style.color = '#4b5563'}
                        >
                            Fork
                        </button>
                        <button
                            style={styles.headerButton}
                            onMouseOver={(e) => e.target.style.color = '#1f2937'}
                            onMouseOut={(e) => e.target.style.color = '#4b5563'}
                        >
                            ⭐
                        </button>
                        <button
                            style={styles.headerButton}
                            onMouseOver={(e) => e.target.style.color = '#1f2937'}
                            onMouseOut={(e) => e.target.style.color = '#4b5563'}
                        >
                            ⋮
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p style={styles.description}>
                    Generate synthetic MNIST-like images using your trained model.
                </p>

                {/* Form */}
                <div style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="digit-select" style={styles.label}>
                            Choose a digit to generate (0-9):
                        </label>
                        <select
                            id="digit-select"
                            value={selectedDigit}
                            onChange={(e) => setSelectedDigit(e.target.value)}
                            style={styles.select}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db';
                                e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                            }}
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                                <option key={digit} value={digit}>{digit}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerateImages}
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : styles.buttonActive)
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#dc2626';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#ef4444';
                            }
                        }}
                    >
                        {loading ? 'Generating...' : 'Generate Images'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                        <p style={styles.errorSubtext}>
                            Showing placeholder images for demonstration.
                        </p>
                    </div>
                )}

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                    <div>
                        <h2 style={styles.resultsTitle}>
                            Generated images of digit {selectedDigit}
                        </h2>
                        <div style={styles.imageGrid}>
                            {generatedImages.map((image, index) => (
                                <div key={image.id || index} style={styles.imageItem}>
                                    <div style={styles.imageContainer}>
                                        <img
                                            src={image.url || image}
                                            alt={`Generated digit ${selectedDigit} sample ${index + 1}`}
                                            style={styles.image}
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
                                    <p style={styles.imageLabel}>Sample {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && generatedImages.length === 0 && (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingContent}>
                            <div style={styles.spinner}></div>
                            <span style={styles.loadingText}>Generating images...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HandwrittenDigitGenerator;