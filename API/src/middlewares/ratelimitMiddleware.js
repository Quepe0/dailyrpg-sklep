const rateLimit = require("express-rate-limit");

const limiter = (maxRequests) =>
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: maxRequests,
    statusCode: 429,
    handler: (req, res) => {
      res.status(429).json({
        message: "Twoje żądanie zostało ograniczone.",
      });
    },
    keyGenerator: (req) => req.headers["cf-connecting-ip"] || req.ip,
    skip: (req, res) => false,
  });

module.exports = limiter;