import React, { useCallback, useState } from 'react';
import { isValidVideoFile, isValidFileSize, formatFileSize } from '../utils/sanitize';
import type { VideoFile } from '../types';
import styles from './VideoUploader.module.css';

interface VideoUploaderProps {
  onVideoSelect: (video: VideoFile) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    if (!isValidVideoFile(file)) {
      setError('Type de fichier non valide. Utilisez MP4, WebM, MOV, AVI ou MKV.');
      return;
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      setError('Fichier trop volumineux. Taille maximale: 500MB.');
      return;
    }

    // Create video object
    const url = URL.createObjectURL(file);
    const videoFile: VideoFile = {
      file,
      url,
      name: file.name,
      size: file.size
    };

    // Get video duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      videoFile.duration = video.duration;
      onVideoSelect(videoFile);
    };
    video.src = url;

  }, [onVideoSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className={styles.uploader}>
      <form
        className={`${styles.uploadForm} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="video-input"
          accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
          onChange={handleChange}
          className={styles.fileInput}
        />
        <label htmlFor="video-input" className={styles.uploadLabel}>
          <div className={styles.uploadIcon}>📹</div>
          <p className={styles.uploadText}>
            Glissez-déposez votre vidéo MP4 ici
          </p>
          <p className={styles.uploadSubtext}>
            ou cliquez pour sélectionner
          </p>
          <p className={styles.uploadFormats}>
            Formats supportés: MP4, WebM, MOV, AVI, MKV (max 500MB)
          </p>
        </label>
      </form>
      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
