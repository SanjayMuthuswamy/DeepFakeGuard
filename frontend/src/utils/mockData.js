// No need to import types in JavaScript
// Removed: import { DetectionResult, HistoryItem } from '../types';

// Generate a mock detection result
export const generateMockResult = (sourceType, fileName) => {
  const id = Math.random().toString(36).substring(2, 10);
  const isDeepfake = Math.random() > 0.5;
  const confidence = isDeepfake 
    ? 0.7 + Math.random() * 0.29 
    : 0.1 + Math.random() * 0.2;

  const numFaces = Math.floor(Math.random() * 3) + 1;

  const faces = Array.from({ length: numFaces }).map((_, i) => {
    const faceConfidence = isDeepfake 
      ? 0.65 + Math.random() * 0.34 
      : 0.05 + Math.random() * 0.25;

    return {
      id: `face-${id}-${i}`,
      boundingBox: {
        x: Math.random() * 0.6 + 0.2,
        y: Math.random() * 0.6 + 0.2,
        width: Math.random() * 0.3 + 0.1,
        height: Math.random() * 0.3 + 0.1,
      },
      confidence: faceConfidence,
      status: faceConfidence > 0.6 ? 'deepfake' : 'authentic',
      manipulationScore: faceConfidence,
      artifacts: faceConfidence > 0.6 ? ['inconsistent_lighting', 'blurry_edges', 'texture_artifacts'] : [],
    };
  });

  const status = confidence > 0.6 ? 'deepfake' : 'authentic';

  let fileUrl = '';
  if (sourceType === 'image') {
    fileUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000) + 1000}/pexels-photo.jpg`;
  } else if (sourceType === 'video') {
    fileUrl = 'https://example.com/video.mp4';
  }

  return {
    id,
    timestamp: new Date().toISOString(),
    sourceType,
    fileName: fileName || `file-${id}.${sourceType === 'image' ? 'jpg' : 'mp4'}`,
    fileUrl,
    status,
    confidence,
    processingTime: Math.random() * 5 + 1,
    detectedFaces: faces,
  };
};

// Generate mock history items
export const generateMockHistory = (count = 10) => {
  return Array.from({ length: count }).map((_, i) => {
    const id = Math.random().toString(36).substring(2, 10);
    const sourceType = Math.random() > 0.5 ? 'image' : (Math.random() > 0.5 ? 'video' : 'webcam');
    const isDeepfake = Math.random() > 0.5;
    const confidence = isDeepfake 
      ? 0.7 + Math.random() * 0.29 
      : 0.1 + Math.random() * 0.2;

    return {
      id,
      timestamp: new Date(Date.now() - i * 86400000 * Math.random()).toISOString(),
      sourceType,
      fileName: `file-${id}.${sourceType === 'image' ? 'jpg' : 'mp4'}`,
      thumbnailUrl: `https://images.pexels.com/photos/${1000 + i}/pexels-photo.jpg`,
      status: confidence > 0.6 ? 'deepfake' : 'authentic',
      confidence,
    };
  });
};

// Mock data for the dashboard
export const dashboardStats = {
  totalScans: 142,
  detectedDeepfakes: 47,
  authenticContent: 95,
  detectionRate: 0.89,
  scansByDay: [12, 8, 15, 22, 18, 25, 42],
  deepfakesByDay: [4, 2, 5, 8, 7, 9, 12],
  commonManipulations: [
    { type: 'Face Swap', count: 28 },
    { type: 'Expression Manipulation', count: 22 },
    { type: 'Entire Face Generation', count: 17 },
    { type: 'Lip Sync', count: 14 },
    { type: 'Age Modification', count: 11 },
  ],
};
