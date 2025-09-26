import { useState, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview?: string;
  existingImage?: string;
  placeholder?: string;
  label: string;
  required?: boolean;
}

const ImageUpload = ({
  onImageSelect,
  preview,
  existingImage,
  placeholder = 'Clique para fazer upload da imagem',
  label,
  required = false
}: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast('Por favor, selecione apenas arquivos de imagem', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">
        {label} {required && '*'}
      </label>
      
      <div
        className={`image-upload-area ${dragOver ? 'drag-over' : ''} ${preview || existingImage ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <div className="image-overlay">
              <span>Clique para alterar</span>
            </div>
          </div>
        ) : existingImage ? (
          <div className="image-preview">
            <img src={existingImage} alt="Imagem atual" />
            <div className="image-overlay">
              <span>Clique para alterar</span>
            </div>
          </div>
        ) : (
          <div className="image-placeholder">
            <div className="upload-icon">📁</div>
            <p>{placeholder}</p>
            <p className="upload-hint">Arraste e solte ou clique para selecionar</p>
            <p className="upload-formats">Formatos: JPG, PNG, GIF</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;