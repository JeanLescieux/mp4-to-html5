import React, { useState } from 'react';
import { generateHTML5Code } from '../utils/converter';
import styles from './CodeOutput.module.css';

interface CodeOutputProps {
  videoUrl: string;
  filename: string;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ videoUrl, filename }) => {
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [muted, setMuted] = useState(false);
  const [width, setWidth] = useState('640');
  const [height, setHeight] = useState('360');
  const [copied, setCopied] = useState(false);

  const code = generateHTML5Code(videoUrl, filename, {
    autoplay,
    loop,
    controls,
    muted,
    width,
    height
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className={styles.output}>
      <h3 className={styles.title}>Code HTML5 généré</h3>
      
      <div className={styles.options}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={controls}
            onChange={(e) => setControls(e.target.checked)}
          />
          Afficher les contrôles
        </label>
        
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
          />
          Lecture automatique
        </label>
        
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          Lecture en boucle
        </label>
        
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={muted}
            onChange={(e) => setMuted(e.target.checked)}
          />
          Vidéo muette
        </label>

        <div className={styles.sizeInputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Largeur:</label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Hauteur:</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={styles.textInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.codeContainer}>
        <pre className={styles.code}>{code}</pre>
        <button onClick={handleCopy} className={styles.copyButton}>
          {copied ? '✓ Copié!' : '📋 Copier le code'}
        </button>
      </div>

      <div className={styles.preview}>
        <h4 className={styles.previewTitle}>Aperçu:</h4>
        <div 
          className={styles.previewContainer}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </div>
    </div>
  );
};
