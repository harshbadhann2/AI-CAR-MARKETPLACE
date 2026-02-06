"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Car, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { completeOnboarding } from "@/actions/user";

const onboardingSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Please enter a valid phone number"),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone: "",
    },
  });

  const {
    loading: onboardingLoading,
    fn: onboardingFn,
    data: onboardingResult,
    error: onboardingError,
  } = useFetch(completeOnboarding);

  useEffect(() => {
    if (onboardingResult?.success) {
      toast.success("Welcome to Vehiql!");
      setStep(3);
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [onboardingResult, router]);

  useEffect(() => {
    if (onboardingError) {
      toast.error(onboardingError.message || "Failed to complete onboarding");
    }
  }, [onboardingError]);

  const onSubmit = async (data) => {
    await onboardingFn(data);
  };

  const handleSkip = async () => {
    await onboardingFn({ phone: null });
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {step === 3 ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <Car className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && `Welcome, ${user.firstName || "there"}!`}
            {step === 2 && "Almost there!"}
            {step === 3 && "You're all set!"}
          </CardTitle>
          <CardDescription>
            {step === 1 &&
              "Let's get your account set up so you can start exploring cars."}
            {step === 2 && "Add your phone number to receive booking updates."}
            {step === 3 && "Your account is ready. Redirecting you..."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">Browse</h3>
                  <p className="text-sm text-gray-600">
                    Explore our curated car collection
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">Save</h3>
                  <p className="text-sm text-gray-600">
                    Save your favorite cars
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">Test Drive</h3>
                  <p className="text-sm text-gray-600">
                    Book test drives easily
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Get Started
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  We'll use this to send you booking confirmations and updates.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleSkip}
                  disabled={onboardingLoading}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={onboardingLoading}
                >
                  {onboardingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to homepage...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
