const MAX_IMAGE_DIMENSION = 512;
const INITIAL_IMAGE_QUALITY = 0.82;
const MIN_IMAGE_QUALITY = 0.5;
const IMAGE_QUALITY_STEP = 0.08;
const MAX_IMAGE_DATA_URL_LENGTH = 450000;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to process the selected image."));
    image.src = src;
  });

const getTargetSize = (width, height) => {
  if (!width || !height) {
    return { width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION };
  }

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
};

const renderToDataUrl = (image, quality) => {
  const canvas = document.createElement("canvas");
  const { width, height } = getTargetSize(image.width, image.height);

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
};

export const optimizeImageFile = async (file) => {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const sourceDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);

  for (
    let quality = INITIAL_IMAGE_QUALITY;
    quality >= MIN_IMAGE_QUALITY;
    quality -= IMAGE_QUALITY_STEP
  ) {
    const optimizedDataUrl = renderToDataUrl(image, quality);

    if (optimizedDataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH) {
      return optimizedDataUrl;
    }
  }

  throw new Error("Image is still too large after compression. Please choose a smaller photo.");
};
