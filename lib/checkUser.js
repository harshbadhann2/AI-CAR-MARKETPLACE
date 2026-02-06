import { currentUser } from "@clerk/nextjs/server";
import { db, isDatabaseConfigured } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Return mock user if database is not configured
    if (!isDatabaseConfigured) {
      return {
        id: "mock-user-id",
        clerkUserId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Demo User",
        email: user.emailAddresses?.[0]?.emailAddress || "demo@example.com",
        imageUrl: user.imageUrl,
        role: "USER",
      };
    }

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log("checkUser error:", error.message);
    return null;
  }
};
