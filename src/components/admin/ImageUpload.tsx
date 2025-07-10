"use client";

import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (url: string) => void;
  selectedImages?: string[];
  multiple?: boolean;
  maxImages?: number;
}

interface UploadedImage {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImageUpload({
  onImageSelect,
  selectedImages = [],
  multiple = false,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Charger les images existantes
  const loadImages = useCallback(async () => {
    setLoadingImages(true);
    try {
      const response = await fetch("/api/upload");
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
    } finally {
      setLoadingImages(false);
    }
  }, []);

  // Charger les images au montage
  useState(() => {
    loadImages();
  });

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          return data;
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Erreur upload:", error);
        alert(
          `Erreur lors de l'upload de ${file.name}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((result) => result !== null);

    if (successfulUploads.length > 0) {
      // Recharger la liste des images
      await loadImages();

      // Sélectionner automatiquement la première image uploadée
      if (successfulUploads[0]) {
        onImageSelect(successfulUploads[0].url);
      }
    }

    setUploading(false);
  };

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
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Zone d'upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-pink-500 bg-pink-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload
              className={`w-8 h-8 ${
                dragActive ? "text-pink-500" : "text-gray-400"
              }`}
            />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? "Upload en cours..." : "Glissez vos images ici"}
            </p>
            <p className="text-sm text-gray-600">
              ou cliquez pour sélectionner des fichiers
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, WebP jusqu'à 5MB
            </p>
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full animate-pulse w-1/2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Galerie d'images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Images disponibles
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={loadImages}
            disabled={loadingImages}
          >
            {loadingImages ? "Chargement..." : "Actualiser"}
          </Button>
        </div>

        {loadingImages ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aucune image uploadée</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <motion.div
                key={image.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImages.includes(image.url)
                    ? "border-pink-500 ring-2 ring-pink-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onImageSelect(image.url)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/img/placeholder.svg";
                    }}
                  />

                  {/* Overlay avec informations */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end">
                    <div className="p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate">{image.name}</p>
                      <p>{formatFileSize(image.size)}</p>
                    </div>
                  </div>

                  {/* Indicateur de sélection */}
                  {selectedImages.includes(image.url) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
