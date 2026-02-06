import { PrismaClient } from "@prisma/client";

// Check if DATABASE_URL is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL;

// Create a mock db object when database is not configured
const mockDb = {
  car: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
  },
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  },
  userSavedCar: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    delete: async () => null,
    count: async () => 0,
  },
  testDriveBooking: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    count: async () => 0,
  },
  dealershipInfo: {
    findFirst: async () => null,
    upsert: async () => null,
  },
  workingHour: {
    findMany: async () => [],
    deleteMany: async () => null,
    createMany: async () => null,
  },
};

let db;

if (isDatabaseConfigured) {
  db = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }
} else {
  console.warn("⚠️ DATABASE_URL not configured. Using mock database.");
  db = mockDb;
}

export { db, isDatabaseConfigured };

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
