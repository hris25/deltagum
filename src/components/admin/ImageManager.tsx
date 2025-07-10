"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { motion } from "framer-motion";
import {
  Copy,
  Eye,
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UploadedImage {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImageManager() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/upload");
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
    } finally {
      setLoading(false);
    }
  };

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

    await Promise.all(uploadPromises);
    await loadImages();
    setUploading(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copiée dans le presse-papiers !");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleImageSelection = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestionnaire d'Images
          </h2>
          <p className="text-gray-600">{images.length} image(s) au total</p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Uploader de nouvelles images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? "Upload en cours..." : "Glissez vos images ici"}
                </p>
                <p className="text-sm text-gray-600">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, WebP jusqu'à 5MB chacune
                </p>
              </div>

              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                  <div className="bg-pink-500 h-2 rounded-full animate-pulse w-1/2"></div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedImages.length > 0 && (
            <Button variant="danger" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer ({selectedImages.length})
            </Button>
          )}
          <Button onClick={loadImages} variant="outline" size="sm">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Aucune image trouvée" : "Aucune image uploadée"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Essayez avec un autre terme de recherche"
                : "Commencez par uploader vos premières images"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImages.includes(image.url)
                  ? "border-pink-500 ring-2 ring-pink-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleImageSelection(image.url)}
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

                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(image.url, "_blank");
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Voir en grand"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.url);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Copier l'URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Indicateur de sélection */}
                {selectedImages.includes(image.url) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="p-2 bg-white">
                <p
                  className="text-xs font-medium text-gray-900 truncate"
                  title={image.name}
                >
                  {image.name}
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(image.size)}</span>
                  <span>{formatDate(image.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
