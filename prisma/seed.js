const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Real car data with reliable Unsplash images
const carsData = [
  {
    make: "Hyundai",
    model: "Creta",
    year: 2024,
    price: 1599000,
    mileage: 5000,
    color: "Titan Grey",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    seats: 5,
    description: "The all-new Hyundai Creta with panoramic sunroof, ventilated seats, ADAS features, and a powerful 1.5L turbo petrol engine. Perfect blend of style and performance.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80"
    ],
  },
  {
    make: "Tata",
    model: "Nexon EV",
    year: 2024,
    price: 1499000,
    mileage: 3000,
    color: "Pristine White",
    fuelType: "Electric",
    transmission: "Automatic",
    bodyType: "SUV",
    seats: 5,
    description: "India's safest EV with 5-star NCAP rating. Features 312km range, fast charging capability, connected car tech, and zero emissions. The future of mobility.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"
    ],
  },
  {
    make: "Mahindra",
    model: "XUV700",
    year: 2024,
    price: 2199000,
    mileage: 8000,
    color: "Midnight Black",
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "SUV",
    seats: 7,
    description: "The flagship SUV with ADAS Level 2, largest-in-class sunroof, 2.2L mHawk diesel engine producing 185PS. Premium 7-seater with unmatched road presence.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"
    ],
  },
  {
    make: "Honda",
    model: "City",
    year: 2024,
    price: 1299000,
    mileage: 12000,
    color: "Radiant Red",
    fuelType: "Petrol",
    transmission: "CVT",
    bodyType: "Sedan",
    seats: 5,
    description: "The elegant Honda City with i-VTEC engine, Honda Sensing safety suite, premium leather interiors, and segment-leading boot space. Timeless design meets modern tech.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80"
    ],
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: 4999000,
    mileage: 15000,
    color: "Alpine White",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "Sedan",
    seats: 5,
    description: "The ultimate driving machine. BMW 330i with TwinPower Turbo engine, M Sport package, iDrive 8.0, and iconic kidney grille. Luxury performance redefined.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80"
    ],
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2023,
    price: 7499000,
    mileage: 5000,
    color: "Race Red",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "Convertible",
    seats: 4,
    description: "American muscle icon. 5.0L V8 producing 450HP, convertible roof, premium B&O sound system, and track-ready performance. Feel the thunder.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=800&q=80",
      "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80"
    ],
  },
  {
    make: "Hyundai",
    model: "i20",
    year: 2024,
    price: 899000,
    mileage: 8000,
    color: "Starry Night",
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Hatchback",
    seats: 5,
    description: "Sporty hatchback with BlueLink connected tech, sunroof, Bose premium audio, and turbocharged performance. Perfect city companion with style.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
    ],
  },
  {
    make: "Tata",
    model: "Harrier",
    year: 2024,
    price: 1899000,
    mileage: 10000,
    color: "Coral Red",
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "SUV",
    seats: 5,
    description: "Built on Land Rover D8 platform. KRYOTEC diesel engine, terrain response modes, panoramic sunroof, and JBL audio. Adventure awaits.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1568844293986-8c3a88e41995?w=800&q=80",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80"
    ],
  },
  {
    make: "Mahindra",
    model: "Thar",
    year: 2024,
    price: 1599000,
    mileage: 6000,
    color: "Aquamarine",
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "SUV",
    seats: 4,
    description: "The legendary off-roader reborn. 4x4 with low-range transfer case, removable roof, and go-anywhere capability. Born to be wild.",
    status: "AVAILABLE",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80"
    ],
  },
  {
    make: "Honda",
    model: "Amaze",
    year: 2024,
    price: 799000,
    mileage: 15000,
    color: "Platinum White",
    fuelType: "Petrol",
    transmission: "CVT",
    bodyType: "Sedan",
    seats: 5,
    description: "Compact sedan with Honda reliability. Best-in-class mileage, spacious interiors, and low maintenance. Perfect first car.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"
    ],
  },
  {
    make: "BMW",
    model: "X5",
    year: 2023,
    price: 9999000,
    mileage: 12000,
    color: "Carbon Black",
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "SUV",
    seats: 7,
    description: "Luxury meets capability. BMW X5 xDrive with air suspension, panoramic sky lounge, gesture control, and M Sport dynamics. Command every road.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80"
    ],
  },
  {
    make: "Hyundai",
    model: "Verna",
    year: 2024,
    price: 1199000,
    mileage: 7000,
    color: "Fiery Red",
    fuelType: "Petrol",
    transmission: "DCT",
    bodyType: "Sedan",
    seats: 5,
    description: "All-new generation Verna with ADAS, dual-zone climate, ventilated seats, and sporty 1.5L turbo engine. Sedan of the year.",
    status: "AVAILABLE",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80"
    ],
  },
];

// Dealership info
const dealershipData = {
  name: "Vehiql Motors",
  address: "123 Auto Mall, Sector 18, Gurugram, Haryana 122001",
  phone: "+91 98765 43210",
  email: "contact@vehiql.com",
};

// Working hours
const workingHoursData = [
  { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "SATURDAY", openTime: "10:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "SUNDAY", openTime: "10:00", closeTime: "16:00", isOpen: false },
];

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.testDriveBooking.deleteMany();
  await prisma.userSavedCar.deleteMany();
  await prisma.car.deleteMany();
  await prisma.workingHour.deleteMany();
  await prisma.dealershipInfo.deleteMany();

  // Create dealership info
  console.log("🏢 Creating dealership info...");
  const dealership = await prisma.dealershipInfo.create({
    data: dealershipData,
  });

  // Create working hours
  console.log("⏰ Creating working hours...");
  for (const hours of workingHoursData) {
    await prisma.workingHour.create({
      data: {
        ...hours,
        dealershipId: dealership.id,
      },
    });
  }

  // Create cars
  console.log("🚗 Creating car listings...");
  for (const car of carsData) {
    await prisma.car.create({
      data: car,
    });
  }

  console.log("\n✅ Database seeded successfully!");
  console.log(`   - ${carsData.length} cars created`);
  console.log(`   - 1 dealership created`);
  console.log(`   - ${workingHoursData.length} working hours created`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
