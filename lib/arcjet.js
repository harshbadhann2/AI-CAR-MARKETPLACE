import arcjet, { tokenBucket } from "@arcjet/next";

const isArcjetConfigured = !!process.env.ARCJET_KEY;

// Mock ArcJet for when key is not configured
const mockAj = {
  protect: async () => ({
    isDenied: () => false,
    reason: null,
  }),
};

let aj;

if (isArcjetConfigured) {
  aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"], // Track based on User IP
    rules: [
      // Rate limiting specifically for collection creation
      tokenBucket({
        mode: "LIVE",
        refillRate: 10, // 10 collections
        interval: 3600, // per hour
        capacity: 10, // maximum burst capacity
      }),
    ],
  });
} else {
  console.warn("⚠️ ARCJET_KEY not configured. Rate limiting disabled.");
  aj = mockAj;
}

export default aj;
export { isArcjetConfigured };
