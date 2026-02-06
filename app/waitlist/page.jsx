"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Car,
  Bell,
  Sparkles,
  Calendar,
} from "lucide-react";
import Image from "next/image";

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

const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

export default function WaitlistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call - In production, connect to your email service
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success("You've been added to the waitlist!");
    reset();
  };

  const features = [
    {
      icon: <Car className="h-6 w-6 text-blue-600" />,
      title: "Exclusive Access",
      description: "Be the first to see new car listings before anyone else",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "Special Offers",
      description: "Get exclusive deals and discounts on test drives",
    },
    {
      icon: <Bell className="h-6 w-6 text-blue-600" />,
      title: "Price Alerts",
      description: "Get notified when prices drop on your favorite cars",
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Priority Booking",
      description: "Book test drives before regular users",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Vehiql Logo"
                width={180}
                height={50}
                className="mx-auto lg:mx-0"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the <span className="text-blue-600">Vehiql</span> Waitlist
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Be the first to know about new car listings, exclusive deals, and
              early access to premium features.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-[450px]">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                {isSubmitted ? (
                  <>
                    <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">You're on the list!</CardTitle>
                    <CardDescription>
                      We'll notify you when we have exciting updates
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-2xl">
                      Reserve Your Spot
                    </CardTitle>
                    <CardDescription>
                      Join 1,000+ car enthusiasts on the waitlist
                    </CardDescription>
                  </>
                )}
              </CardHeader>

              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-6">
                      Thank you for joining! Check your email for confirmation.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Add Another Email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...register("phone")}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join Waitlist"
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      By joining, you agree to receive updates from Vehiql. You
                      can unsubscribe at any time.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
