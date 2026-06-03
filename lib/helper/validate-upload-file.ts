const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const validateUploadFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type))
    return `Unsupported type: ${file.type}. Use image format like JPEG, PNG, WebP.`;
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return `File too large. Max size is ${MAX_SIZE_MB}MB.`;
  return null;
};

export default validateUploadFile;
