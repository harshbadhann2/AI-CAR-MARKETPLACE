"use client";

import { useState, useEffect } from "react";
import { Search, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { processImageSearch } from "@/actions/home";
import useFetch from "@/hooks/use-fetch";

export function HomeSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);

  // Use the useFetch hook for image processing
  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  // Handle process result and errors with useEffect
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();

      // Add extracted params to the search
      if (processResult.data.make) params.set("make", processResult.data.make);
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);
      if (processResult.data.color)
        params.set("color", processResult.data.color);

      // Redirect to search results
      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult, router]);

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  // Handle image upload with react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });

  // Handle text search submissions
  const handleTextSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  // Handle image search submissions
  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }

    // Use the processImageFn from useFetch hook
    await processImageFn(searchImage);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleTextSearch} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-6 h-6 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by make, model, or try AI Image Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-32 py-7 w-full rounded-full border-white/10 bg-black/60 backdrop-blur-xl text-lg text-white placeholder:text-gray-500 shadow-2xl focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all duration-300"
          />

          {/* Image Search Button */}
          <div className="absolute right-[110px] top-1/2 -translate-y-1/2">
            <div
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${isImageSearchActive ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
            >
              <Camera size={24} />
            </div>
          </div>

          <Button
            type="submit"
            className="absolute right-2 top-2 bottom-2 rounded-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-blue-500/20"
          >
            Search
          </Button>
        </div>
      </form>

      {isImageSearchActive && (
        <div className="mt-6 animate-accordion-down">
          <form onSubmit={handleImageSearch} className="glass-panel rounded-3xl p-6 border-white/10">
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all duration-300">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={imagePreview}
                      alt="Car preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchImage(null);
                      setImagePreview("");
                      toast.info("Image removed");
                    }}
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer group">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors duration-300">
                      <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white mb-1">
                        {isDragActive && !isDragReject
                          ? "Drop your image here"
                          : "Upload a car image"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Drag and drop or click to browse
                      </p>
                    </div>
                    {isDragReject && (
                      <p className="text-red-400 text-sm font-medium">Invalid file type</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600"
                disabled={isUploading || isProcessing}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Uploading...
                  </span>
                ) : isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Analyzing Magic...
                  </span>
                ) : (
                  "Search with AI Vision"
                )}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
