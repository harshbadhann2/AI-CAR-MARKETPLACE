"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, X, Upload, ArrowLeft } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateCar } from "@/actions/cars";
import useFetch from "@/hooks/use-fetch";
import Image from "next/image";
import Link from "next/link";

// Predefined options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

// Define form schema with Zod
const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
});

export const EditCarForm = ({ car }) => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState(car.images || []);
  const [newImages, setNewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState("");

  // Initialize form with react-hook-form and zod
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: car.make || "",
      model: car.model || "",
      year: car.year?.toString() || "",
      price: car.price?.toString() || "",
      mileage: car.mileage?.toString() || "",
      color: car.color || "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      bodyType: car.bodyType || "",
      seats: car.seats?.toString() || "",
      description: car.description || "",
      status: car.status || "AVAILABLE",
      featured: car.featured || false,
    },
  });

  // Custom hooks for API calls
  const {
    loading: updateCarLoading,
    fn: updateCarFn,
    data: updateCarResult,
    error: updateCarError,
  } = useFetch(updateCar);

  // Handle successful car update
  useEffect(() => {
    if (updateCarResult?.success) {
      toast.success("Car updated successfully");
      router.push("/admin/cars");
    }
  }, [updateCarResult, router]);

  useEffect(() => {
    if (updateCarError) {
      toast.error(updateCarError.message || "Failed to update car");
    }
  }, [updateCarError]);

  // Handle multiple image uploads with Dropzone
  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Process the images
        const processedImages = [];
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            processedImages.push(e.target.result);

            // When all images are processed
            if (processedImages.length === validFiles.length) {
              setNewImages((prev) => [...prev, ...processedImages]);
              setUploadProgress(0);
              setImageError("");
              toast.success(
                `Successfully uploaded ${validFiles.length} images`
              );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 200);
  }, []);

  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  // Remove existing image
  const removeExistingImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    // Check if at least one image exists
    if (uploadedImages.length === 0 && newImages.length === 0) {
      setImageError("Please have at least one image");
      return;
    }

    // Prepare data for server action
    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    // Call the updateCar function
    await updateCarFn({
      id: car.id,
      carData,
      existingImages: uploadedImages,
      newImages: newImages,
    });
  };

  return (
    <div>
      <Link href="/admin/cars">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cars
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Car Details</CardTitle>
          <CardDescription>
            Update the information for {car.year} {car.make} {car.model}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make">
                  Make <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="make"
                  {...register("make")}
                  placeholder="e.g., Toyota"
                  className={errors.make ? "border-red-500" : ""}
                />
                {errors.make && (
                  <p className="text-xs text-red-500">{errors.make.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g., Camry"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && (
                  <p className="text-xs text-red-500">{errors.model.message}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g., 2023"
                  className={errors.year ? "border-red-500" : ""}
                />
                {errors.year && (
                  <p className="text-xs text-red-500">{errors.year.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  {...register("price")}
                  placeholder="e.g., 25000"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage">
                  Mileage <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mileage"
                  {...register("mileage")}
                  placeholder="e.g., 15000"
                  className={errors.mileage ? "border-red-500" : ""}
                />
                {errors.mileage && (
                  <p className="text-xs text-red-500">
                    {errors.mileage.message}
                  </p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">
                  Color <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="color"
                  {...register("color")}
                  placeholder="e.g., White"
                  className={errors.color ? "border-red-500" : ""}
                />
                {errors.color && (
                  <p className="text-xs text-red-500">{errors.color.message}</p>
                )}
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType">
                  Fuel Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("fuelType", value)}
                  defaultValue={watch("fuelType")}
                >
                  <SelectTrigger
                    className={errors.fuelType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-xs text-red-500">
                    {errors.fuelType.message}
                  </p>
                )}
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission">
                  Transmission <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("transmission", value)}
                  defaultValue={watch("transmission")}
                >
                  <SelectTrigger
                    className={errors.transmission ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && (
                  <p className="text-xs text-red-500">
                    {errors.transmission.message}
                  </p>
                )}
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <Label htmlFor="bodyType">
                  Body Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("bodyType", value)}
                  defaultValue={watch("bodyType")}
                >
                  <SelectTrigger
                    className={errors.bodyType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bodyType && (
                  <p className="text-xs text-red-500">
                    {errors.bodyType.message}
                  </p>
                )}
              </div>

              {/* Seats */}
              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  {...register("seats")}
                  placeholder="e.g., 5"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue={watch("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {carStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the car's features, condition, history..."
                className={`min-h-32 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => {
                  setValue("featured", checked);
                }}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="featured">Feature this car</Label>
                <p className="text-sm text-gray-500">
                  Featured cars appear on the homepage
                </p>
              </div>
            </div>

            {/* Current Images */}
            <div>
              <Label className={imageError ? "text-red-500" : ""}>
                Current Images{" "}
                {imageError && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-2">
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Car image ${index + 1}`}
                          height={112}
                          width={150}
                          className="h-28 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No existing images</p>
                )}
              </div>
            </div>

            {/* Add New Images */}
            <div>
              <Label>Add New Images</Label>
              <div className="mt-2">
                <div
                  {...getMultiImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${
                    imageError ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input {...getMultiImageInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600">
                      Drag & drop or click to upload new images
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      (JPG, PNG, WebP, max 5MB each)
                    </span>
                  </div>
                </div>
                {imageError && (
                  <p className="text-xs text-red-500 mt-1">{imageError}</p>
                )}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* New Image Previews */}
              {newImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">
                    New Images ({newImages.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`New image ${index + 1}`}
                          height={112}
                          width={150}
                          className="h-28 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 md:flex-none"
                disabled={updateCarLoading}
              >
                {updateCarLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Car"
                )}
              </Button>
              <Link href="/admin/cars">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
