const categories = ["standart", "polulyuks", "lyuks", "apartament", "bir_kishilik"];
const statuses = ["bosh", "band", "remont"];
const imageSchema = {
  type: "object",
  additionalProperties: false,
  required: ["url"],
  properties: {
    _id: { type: "string" },
    url: { type: "string", minLength: 1 },
    displayUrl: { type: "string" },
    thumbnailUrl: { type: "string" },
  },
};

const createRoomSchema = {
  type: "object",
  additionalProperties: false,
  required: ["roomNumber", "floor", "capacity", "category", "prices"],
  properties: {
    roomNumber: { type: "string", minLength: 1 },
    floor: { type: "number", minimum: 1 },
    capacity: { type: "number", minimum: 1 },
    category: { type: "string", enum: categories },
    prices: {
      type: "object",
      additionalProperties: false,
      required: ["oddiy", "chetEllik"],
      properties: {
        oddiy: { type: "number", minimum: 0 },
        chetEllik: { type: "number", minimum: 0 },
      },
    },
    description: { type: "string" },
    status: { type: "string", enum: statuses },
    images: { type: "array", maxItems: 8, items: imageSchema },
  },
};

const updateRoomSchema = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: {
    roomNumber: { type: "string", minLength: 1 },
    floor: { type: "number", minimum: 1 },
    capacity: { type: "number", minimum: 1 },
    category: { type: "string", enum: categories },
    prices: {
      type: "object",
      additionalProperties: false,
      properties: {
        oddiy: { type: "number", minimum: 0 },
        chetEllik: { type: "number", minimum: 0 },
      },
    },
    description: { type: "string" },
    status: { type: "string", enum: statuses },
    images: { type: "array", maxItems: 8, items: imageSchema },
  },
};

const roomIdParamsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: {
    id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
  },
};

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  roomIdParamsSchema,
};
