"use server";

import { serializeCarData } from "@/lib/helpers";
import { db, isDatabaseConfigured } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Mock filters data
const mockFilters = {
  makes: ["Toyota", "Honda", "BMW", "Tesla", "Ford", "Hyundai", "Tata", "Mahindra"],
  bodyTypes: ["SUV", "Sedan", "Hatchback", "Convertible"],
  fuelTypes: ["Petrol", "Diesel", "Electric", "Hybrid"],
  transmissions: ["Automatic", "Manual"],
  priceRange: { min: 500000, max: 10000000 },
};

// Mock cars data
const mockCars = [
  {
    id: "mock-1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 2500000,
    images: ["/1.png"],
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "Sedan",
    mileage: 15000,
    color: "White",
    description: "Well-maintained Toyota Camry with low mileage.",
    status: "AVAILABLE",
    featured: true,
    wishlisted: false,
  },
  {
    id: "mock-2",
    make: "Honda",
    model: "Civic",
    year: 2023,
    price: 2200000,
    images: ["/2.webp"],
    transmission: "Manual",
    fuelType: "Petrol",
    bodyType: "Sedan",
    mileage: 12000,
    color: "Blue",
    description: "Sporty Honda Civic in excellent condition.",
    status: "AVAILABLE",
    featured: true,
    wishlisted: false,
  },
  {
    id: "mock-3",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 4500000,
    images: ["/3.jpg"],
    transmission: "Automatic",
    fuelType: "Electric",
    bodyType: "Sedan",
    mileage: 8000,
    color: "Red",
    description: "Premium electric vehicle with autopilot features.",
    status: "AVAILABLE",
    featured: true,
    wishlisted: false,
  },
  {
    id: "mock-4",
    make: "BMW",
    model: "X5",
    year: 2023,
    price: 8500000,
    images: ["/1.png"],
    transmission: "Automatic",
    fuelType: "Diesel",
    bodyType: "SUV",
    mileage: 5000,
    color: "Black",
    description: "Luxury BMW X5 with premium features.",
    status: "AVAILABLE",
    featured: false,
    wishlisted: false,
  },
  {
    id: "mock-5",
    make: "Ford",
    model: "Mustang",
    year: 2022,
    price: 7500000,
    images: ["/2.webp"],
    transmission: "Manual",
    fuelType: "Petrol",
    bodyType: "Convertible",
    mileage: 10000,
    color: "Yellow",
    description: "Classic Ford Mustang convertible.",
    status: "AVAILABLE",
    featured: false,
    wishlisted: false,
  },
  {
    id: "mock-6",
    make: "Hyundai",
    model: "Tucson",
    year: 2023,
    price: 3200000,
    images: ["/3.jpg"],
    transmission: "Automatic",
    fuelType: "Hybrid",
    bodyType: "SUV",
    mileage: 3000,
    color: "Silver",
    description: "Fuel-efficient Hyundai Tucson Hybrid.",
    status: "AVAILABLE",
    featured: false,
    wishlisted: false,
  },
];

/**
 * Get simplified filters for the car marketplace
 */
export async function getCarFilters() {
  try {
    // Return mock data if database is not configured
    if (!isDatabaseConfigured) {
      return {
        success: true,
        data: mockFilters,
      };
    }

    // Get unique makes
    const makes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });

    // Get unique body types
    const bodyTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    // Get unique fuel types
    const fuelTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // Get unique transmissions
    const transmissions = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // Get min and max prices using Prisma aggregations
    const priceAggregations = await db.car.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmissions: transmissions.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 10000000,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching car filters:", error.message);
    return {
      success: true,
      data: mockFilters,
    };
  }
}

/**
 * Get cars with simplified filters
 */
export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    // Return mock data if database is not configured
    if (!isDatabaseConfigured) {
      let filteredCars = [...mockCars];

      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        filteredCars = filteredCars.filter(
          (car) =>
            car.make.toLowerCase().includes(searchLower) ||
            car.model.toLowerCase().includes(searchLower)
        );
      }
      if (make) filteredCars = filteredCars.filter((car) => car.make.toLowerCase() === make.toLowerCase());
      if (bodyType) filteredCars = filteredCars.filter((car) => car.bodyType.toLowerCase() === bodyType.toLowerCase());
      if (fuelType) filteredCars = filteredCars.filter((car) => car.fuelType.toLowerCase() === fuelType.toLowerCase());
      if (transmission) filteredCars = filteredCars.filter((car) => car.transmission.toLowerCase() === transmission.toLowerCase());
      if (minPrice) filteredCars = filteredCars.filter((car) => car.price >= minPrice);
      if (maxPrice < Number.MAX_SAFE_INTEGER) filteredCars = filteredCars.filter((car) => car.price <= maxPrice);

      // Sort
      if (sortBy === "priceAsc") filteredCars.sort((a, b) => a.price - b.price);
      else if (sortBy === "priceDesc") filteredCars.sort((a, b) => b.price - a.price);

      // Paginate
      const start = (page - 1) * limit;
      const paginatedCars = filteredCars.slice(start, start + limit);

      return {
        success: true,
        data: paginatedCars,
        pagination: {
          total: filteredCars.length,
          page,
          limit,
          pages: Math.ceil(filteredCars.length / limit),
        },
      };
    }

    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    // Add price range
    where.price = {
      gte: parseFloat(minPrice) || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCars = await db.car.count({ where });

    // Execute the main query
    const cars = await db.car.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    // If we have a user, check which cars are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbUser.id },
        select: { carId: true },
      });

      wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

    // Serialize and check wishlist status
    const serializedCars = cars.map((car) =>
      serializeCarData(car, wishlisted.has(car.id))
    );

    return {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching cars:" + error.message);
  }
}

/**
 * Toggle car in user's wishlist
 */
export async function toggleSavedCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if car exists
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if car is already saved
    const existingSave = await db.userSavedCar.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    // If car is already saved, remove it
    if (existingSave) {
      await db.userSavedCar.delete({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      });

      revalidatePath(`/saved-cars`);
      return {
        success: true,
        saved: false,
        message: "Car removed from favorites",
      };
    }

    // If car is not saved, add it
    await db.userSavedCar.create({
      data: {
        userId: user.id,
        carId,
      },
    });

    revalidatePath(`/saved-cars`);
    return {
      success: true,
      saved: true,
      message: "Car added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved car:" + error.message);
  }
}

/**
 * Get car details by ID
 */
export async function getCarById(carId) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Get car details
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if car is wishlisted by user
    let isWishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSavedCar.findUnique({
        where: {
          userId_carId: {
            userId: dbUser.id,
            carId,
          },
        },
      });

      isWishlisted = !!savedCar;
    }

    // Check if user has already booked a test drive for this car
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        carId,
        userId: dbUser.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let userTestDrive = null;

    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        status: existingTestDrive.status,
        bookingDate: existingTestDrive.bookingDate.toISOString(),
      };
    }

    // Get dealership info for test drive availability
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serializeCarData(car, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching car details:" + error.message);
  }
}

/**
 * Get user's saved cars
 */
export async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the user from our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get saved cars with their details
    const savedCars = await db.userSavedCar.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { savedAt: "desc" },
    });

    // Extract and format car data
    const cars = savedCars.map((saved) => serializeCarData(saved.car));

    return {
      success: true,
      data: cars,
    };
  } catch (error) {
    console.error("Error fetching saved cars:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
