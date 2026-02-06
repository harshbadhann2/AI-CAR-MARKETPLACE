"use server";

import { db, isDatabaseConfigured } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Complete user onboarding
 */
export async function completeOnboarding({ phone }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not found");

    if (!isDatabaseConfigured) {
      return {
        success: true,
        data: {
          id: "demo-user",
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Demo User",
          email: clerkUser.emailAddresses?.[0]?.emailAddress || "demo@example.com",
        },
      };
    }

    // Check if user exists in our database
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (user) {
      // Update existing user with phone if provided
      if (phone) {
        user = await db.user.update({
          where: { clerkUserId: userId },
          data: { phone },
        });
      }
    } else {
      // Create new user
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: name || "User",
          imageUrl: clerkUser.imageUrl,
          phone: phone || null,
        },
      });
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get current user profile
 */
export async function getUserProfile() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        _count: {
          select: {
            savedCars: true,
            testDrives: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        savedCarsCount: user._count.savedCars,
        testDrivesCount: user._count.testDrives,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile({ name, phone }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    const user = await db.user.update({
      where: { clerkUserId: userId },
      data: updateData,
    });

    revalidatePath("/profile");

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get user statistics for profile page
 */
export async function getUserStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get various statistics
    const [
      savedCarsCount,
      totalTestDrives,
      completedTestDrives,
      upcomingTestDrives,
    ] = await Promise.all([
      db.userSavedCar.count({
        where: { userId: user.id },
      }),
      db.testDriveBooking.count({
        where: { userId: user.id },
      }),
      db.testDriveBooking.count({
        where: { userId: user.id, status: "COMPLETED" },
      }),
      db.testDriveBooking.count({
        where: {
          userId: user.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          bookingDate: { gte: new Date() },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        savedCars: savedCarsCount,
        totalTestDrives,
        completedTestDrives,
        upcomingTestDrives,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
