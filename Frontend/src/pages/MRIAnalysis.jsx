import { useState } from 'react';
import { BeakerIcon, ArrowUpTrayIcon, BoltIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function MRIAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAnalysis(null);
    setError(null);

    // Create preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/predict', {
        method: 'POST',
        body: formData,
      });

      // First check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || 'Failed to analyze MRI');
        } catch (parseError) {
          // If parsing fails, it's likely HTML
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the MRI');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Brain Tumor Detection
          </h1>
          <div className="mt-3 max-w-2xl mx-auto">
            <p className="text-lg text-gray-600">
              Upload your MRI scan for instant AI-powered analysis
            </p>
          </div>
        </div>

        {!analysis ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <BoltIcon className="h-5 w-5 mr-2" />
                  Upload Your MRI Scan
                </h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto h-64 w-auto object-contain rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="flex flex-col items-center py-6">
                          <div className="bg-blue-100 rounded-full p-3 mb-4">
                            <ArrowUpTrayIcon className="h-10 w-10 text-blue-600" />
                          </div>
                          <p className="text-gray-700 font-medium">
                            Drag and drop your MRI image or{' '}
                            <label
                              htmlFor="file-upload"
                              className="text-blue-600 hover:text-blue-500 cursor-pointer font-semibold"
                            >
                              click to browse
                            </label>
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG, JPEG up to 16MB
                          </p>
                        </div>
                      )}
                      {file && (
                        <div className="bg-blue-50 rounded-lg p-2 inline-flex items-center">
                          <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-sm text-blue-800 font-medium">
                            Selected: {file.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !file}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-all duration-150 ${loading || !file
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BeakerIcon className="h-5 w-5 mr-2" />
                          Analyze MRI Scan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  Analysis Results
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                      <BeakerIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Uploaded MRI Image
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <img
                        src={analysis.image_url || preview}
                        alt="MRI scan"
                        className="mx-auto max-h-80 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                      <BeakerIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Diagnostic Information
                    </h3>

                    <div>
                      <h4 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-2">
                        Prediction
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                        <p className="text-xl font-medium text-blue-700">
                          {analysis.prediction}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-2">
                        Confidence Scores
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(analysis.confidence_scores).map(([class_name, score]) => (
                          <div key={class_name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">
                                {class_name}
                              </span>
                              <span className="text-gray-500">
                                {score.toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6 flex justify-center">
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setAnalysis(null);
                      setError(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    Analyze Another Scan
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-100 text-sm text-blue-800">
              <p className="font-medium mb-1">Important Note:</p>
              <p>This AI analysis is for informational purposes only and should not replace professional medical advice.
                Please consult with a healthcare professional for proper diagnosis and treatment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
