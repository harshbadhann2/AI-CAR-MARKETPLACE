"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  Heart,
  Edit2,
  Save,
  X,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { updateUserProfile } from "@/actions/user";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[+]?[\d\s-]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export function ProfileContent({ profile, stats }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
    },
  });

  const {
    loading: updateLoading,
    fn: updateFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUserProfile);

  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    }
  }, [updateResult, router]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update profile");
    }
  }, [updateError]);

  const onSubmit = async (data) => {
    await updateFn({
      name: data.name,
      phone: data.phone || null,
    });
  };

  const handleCancel = () => {
    reset({
      name: profile.name || "",
      phone: profile.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {profile.imageUrl ? (
                    <Image
                      src={profile.imageUrl}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Form / Display */}
              <div className="flex-1">
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...register("name")} />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email is managed through your Clerk account
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={updateLoading}>
                        {updateLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {profile.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {format(new Date(profile.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {profile.role === "ADMIN" && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <Badge variant="secondary">Administrator</Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Card */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your activity on Vehiql</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/saved-cars" className="block">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Saved Cars</span>
                </div>
                <span className="text-xl font-bold">
                  {stats?.savedCars || 0}
                </span>
              </div>
            </Link>

            <Link href="/reservations" className="block">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>Total Test Drives</span>
                </div>
                <span className="text-xl font-bold">
                  {stats?.totalTestDrives || 0}
                </span>
              </div>
            </Link>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-green-600" />
                <span>Completed</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {stats?.completedTestDrives || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span>Upcoming</span>
              </div>
              <span className="text-xl font-bold text-amber-600">
                {stats?.upcomingTestDrives || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cars" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Car className="h-4 w-4 mr-2" />
                Browse Cars
              </Button>
            </Link>
            <Link href="/saved-cars" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                View Saved Cars
              </Button>
            </Link>
            <Link href="/reservations" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                My Reservations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
