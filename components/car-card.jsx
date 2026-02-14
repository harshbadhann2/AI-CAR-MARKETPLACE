"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Car as CarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSavedCar } from "@/actions/car-listing";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

export const CarCard = ({ car }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(car.wishlisted);

  // Use the useFetch hook
  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // Handle save/unsave car
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    // Call the toggleSavedCar function using our useFetch hook
    await toggleSavedCarFn(car.id);
  };

  return (
    <Card className="group overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="relative h-48 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-slate-600" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full p-2 backdrop-blur-md transition-all duration-300 ${isSaved
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
              : "bg-black/30 text-white hover:bg-black/50"
            }`}
          onClick={handleToggleSave}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={18} />
          )}
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold font-heading text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span>{car.year}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span>{car.transmission}</span>
            </p>
          </div>
          <p className="text-lg font-bold text-blue-400">
            ₹{car.price.toLocaleString("en-IN", { maximumSignificantDigits: 3 })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 font-normal">
            {car.bodyType}
          </Badge>
          <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 font-normal">
            {car.fuelType}
          </Badge>
          <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 font-normal">
            {car.mileage.toLocaleString("en-IN")} km
          </Badge>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none"
          onClick={() => {
            router.push(`/cars/${car.id}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
