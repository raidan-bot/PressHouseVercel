import React, { useState, useRef, useCallback } from 'react';
import { Crop, RotateCw, FlipHorizontal, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  className?: string;
}

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scale: number;
}

export function ImageCropper({ image, onCrop, onCancel, className }: ImageCropperProps) {
  const [crop, setCrop] = useState<CropState>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotate: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  }, [crop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCrop((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setCrop((prev) => ({
      ...prev,
      scale: direction === 'in' ? Math.min(prev.scale + 0.1, 3) : Math.max(prev.scale - 0.1, 0.5),
    }));
  };

  const handleRotate = () => {
    setCrop((prev) => ({ ...prev, rotate: (prev.rotate + 90) % 360 }));
  };

  const handleFlip = () => {
    setCrop((prev) => ({ ...prev, x: -prev.x }));
  };

  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      imageRef.current,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    onCrop(canvas.toDataURL());
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-2xl bg-slate-100 cursor-move"
        style={{ width: '100%', height: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={image}
          alt="Crop"
          className="w-full h-full object-contain"
          style={{
            transform: `translate(${crop.x}px, ${crop.y}px) rotate(${crop.rotate}deg) scale(${crop.scale})`,
          }}
        />

        {/* Crop overlay */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
          style={{
            left: '20%',
            top: '20%',
            width: '60%',
            height: '60%',
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleZoom('in')}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleZoom('out')}>
            <ZoomOut size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRotate}>
            <RotateCw size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleFlip}>
            <FlipHorizontal size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={16} />
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleCrop}>
            <Check size={16} />
            Crop
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;