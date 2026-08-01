const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");

const allowedOrigins = [
  "https://imkon.my-hotels.uz",
  "http://localhost:5173",
  ...(process.env.CLIENT_ORIGINS || "").split(","),
]
  .map(normalizeOrigin)
  .filter(Boolean);

const isOriginAllowed = (origin) =>
  !origin || allowedOrigins.includes(normalizeOrigin(origin));

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: ${origin} domeniga ruxsat berilmagan`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = { allowedOrigins, corsOptions };
