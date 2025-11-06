import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Info } from 'lucide-react';
import axios from 'axios';

// Spinner component
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // <-- for info tooltip
  const navigate = useNavigate();
  const inputFileRef = useRef(null);

  const handleFile = (file) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        if (video.duration > 30) {
          alert("Video duration exceeds 30 seconds. Please choose a shorter video.");
          return;
        }
        handleFile(file);
      };
    } else {
      handleFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputFileRef.current) inputFileRef.current.value = null;
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'video';
      const endpoint = fileType === 'image'
        ? 'http://127.0.0.1:8000/predict/image'
        : 'http://127.0.0.1:8000/predict/video';

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const apiResult = response.data;

      const result = {
        id: Date.now(),
        fileName: selectedFile.name,
        fileUrl: URL.createObjectURL(selectedFile),
        sourceType: fileType,
        status: apiResult.result.toLowerCase() === 'fake' ? 'deepfake' : 'authentic',
        confidence: 1 - apiResult.score,
        raw: apiResult,
      };

      navigate(`/results/${result.id}`, { state: { result } });

    } catch (error) {
      alert('Error analyzing file. Check backend logs.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">
            Analyze Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Media</span>
          </h1>
          <div className="relative">
            <Info size={20} className="text-gray-400 cursor-pointer" onClick={() => setShowInfo(!showInfo)} />
            {showInfo && (
              <div className="absolute top-6 right-0 w-72 p-3 text-sm text-gray-900 bg-white rounded-lg shadow-lg z-50">
                <p>• Confidence score indicates how much you can trust the result.</p>
                <p>• Uploaded files are processed locally or on the server and are not stored.</p>
                <p>• AI-generated results are indicative, not guaranteed.</p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 text-lg text-white/70">Upload a file to check for deepfake manipulation.</p>

        <div className="mt-12">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`p-8 bg-gray-800/50 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'}`}
          >
            <input
              id="file-upload"
              type="file"
              ref={inputFileRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            {selectedFile ? (
              <div>
                <div className="flex items-center justify-center font-medium">
                  <FileText size={20} className="text-purple-400 mr-2"/>
                  <span className="truncate">{selectedFile.name}</span>
                </div>
                <div className="mt-4 flex justify-center items-center gap-4">
                  <label htmlFor="file-upload" className="text-sm cursor-pointer text-blue-400 hover:underline">Change file</label>
                  <button onClick={clearFile} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                </div>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadIcon size={32} className="mb-4 text-gray-400" />
                <p className="font-semibold text-white">Drag & drop or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">Images and videos up to 10MB</p>
                <p className="text-sm text-gray-500 mt-1">(Videos must be under 30 seconds)</p>
              </label>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isProcessing}
            className="w-full inline-flex items-center justify-center text-white text-lg tracking-wide px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing && <Spinner />}
            {isProcessing ? 'Analyzing...' : 'Analyze for Deepfakes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
