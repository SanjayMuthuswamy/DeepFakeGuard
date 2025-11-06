import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image } from 'lucide-react';
import Button from './ui/Button';
import { motion } from 'framer-motion';

const FileUploader = ({ onFileSelected, accept, maxSize = 10485760 }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelected(file);

        if (file.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);

          return () => URL.revokeObjectURL(objectUrl);
        }
      }
    },
    [onFileSelected]
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const getErrorMessage = () => {
    if (fileRejections.length === 0) return null;

    const rejection = fileRejections[0];
    if (rejection.errors[0].code === 'file-too-large') {
      return `File is too large. Max size is ${maxSize / 1024 / 1024}MB.`;
    }
    if (rejection.errors[0].code === 'file-invalid-type') {
      return 'File type not supported.';
    }
    return rejection.errors[0].message;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragAccept
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-h-48 max-w-full rounded-lg" />
          </div>
        ) : (
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-4">
            {accept['image/*'] && accept['video/*'] ? (
              <Upload size={40} />
            ) : accept['image/*'] ? (
              <Image size={40} />
            ) : (
              <File size={40} />
            )}
          </div>
        )}

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {accept['image/*'] && accept['video/*']
            ? 'Supports images (JPG, PNG) and videos (MP4)'
            : accept['image/*']
            ? 'Supports JPG, PNG, WebP images'
            : 'Supports MP4, WebM videos'}
        </p>

        <Button variant="outline" type="button">
          Browse Files
        </Button>

        {fileRejections.length > 0 && (
          <motion.p
            className="mt-4 text-sm text-red-600 dark:text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getErrorMessage()}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
