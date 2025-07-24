import ratelimit from "../src/config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-limit-key");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    0}

    // ✅ Pass to next middleware if successful
    next();
  } catch (error) {
    console.error("Rate limiter error:", error.message); // optional log

    // In production, you can allow requests if rate limiting fails (fail open)
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default rateLimiter;
