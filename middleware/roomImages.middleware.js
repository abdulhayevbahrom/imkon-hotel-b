const multer = require("multer");

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const roomImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (_, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      return callback(new Error("Faqat JPG, PNG yoki WEBP rasm yuklash mumkin"));
    }
    return callback(null, true);
  },
}).array("images", 8);

const uploadRoomImages = (req, res, next) => {
  roomImageUpload(req, res, (error) => {
    if (!error) return next();
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Har bir rasm 8 MB dan oshmasligi kerak"
        : error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
          ? "Eng ko'pi 8 ta rasm yuklash mumkin"
          : error.message || "Rasm yuklashda xatolik";
    return res.status(400).json({ state: false, message, innerData: null });
  });
};

const parseRoomPayload = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.payload || "{}");
    return next();
  } catch (_) {
    return res.status(400).json({ message: "Xona ma'lumotlari noto'g'ri formatda" });
  }
};

module.exports = { uploadRoomImages, parseRoomPayload };
