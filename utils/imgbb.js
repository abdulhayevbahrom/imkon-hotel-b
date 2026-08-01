const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

const uploadImage = async (file) => {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("IMGBB_API_KEY sozlanmagan");

  const body = new FormData();
  body.append(
    "image",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname,
  );

  const uploadResponse = await fetch(
    `${IMGBB_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body },
  );
  const result = await uploadResponse.json();
  if (!uploadResponse.ok || !result?.success) {
    throw new Error(result?.error?.message || "ImgBB'ga rasm yuklanmadi");
  }

  return {
    url: result.data.url,
    displayUrl: result.data.display_url || result.data.url,
    thumbnailUrl: result.data.thumb?.url || result.data.url,
  };
};

const uploadImages = (files = []) => Promise.all(files.map(uploadImage));

module.exports = { uploadImages };
