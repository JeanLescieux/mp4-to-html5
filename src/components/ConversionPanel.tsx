import { useState } from 'react';
import type { ConversionOptions } from '../types';
import styles from './ConversionPanel.module.css';

interface ConversionPanelProps {
  onConvert: (options: ConversionOptions) => void;
  disabled?: boolean;
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({ onConvert, disabled }) => {
  const [format, setFormat] = useState<'webm' | 'mp4'>('mp4');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [customSize, setCustomSize] = useState(false);
  const [width, setWidth] = useState<number>(1280);
  const [height, setHeight] = useState<number>(720);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleConvert = () => {
    const options: ConversionOptions = {
      format,
      quality,
      maintainAspectRatio,
      ...(customSize && { width, height })
    };
    onConvert(options);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Options de conversion</h3>
      
      <div className={styles.section}>
        <label className={styles.label}>Format de sortie:</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="mp4"
              checked={format === 'mp4'}
              onChange={(e) => setFormat(e.target.value as 'mp4')}
              disabled={disabled}
            />
            MP4 (H.264) - Meilleure compatibilité
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="webm"
              checked={format === 'webm'}
              onChange={(e) => setFormat(e.target.value as 'webm')}
              disabled={disabled}
            />
            WebM (VP9) - Meilleure compression
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Qualité:</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as 'high' | 'medium' | 'low')}
          disabled={disabled}
          className={styles.select}
        >
          <option value="high">Haute (fichier plus lourd)</option>
          <option value="medium">Moyenne (recommandé)</option>
          <option value="low">Basse (fichier plus léger)</option>
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={customSize}
            onChange={(e) => setCustomSize(e.target.checked)}
            disabled={disabled}
          />
          Personnaliser la résolution
        </label>
        
        {customSize && (
          <div className={styles.sizeInputs}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Largeur (px):</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                disabled={disabled}
                min={320}
                max={3840}
                className={styles.numberInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Hauteur (px):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                disabled={disabled}
                min={240}
                max={2160}
                className={styles.numberInput}
              />
            </div>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                disabled={disabled}
              />
              Conserver le ratio d'aspect
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleConvert}
        disabled={disabled}
        className={styles.convertButton}
      >
        🎬 Convertir en HTML5
      </button>
    </div>
  );
};
