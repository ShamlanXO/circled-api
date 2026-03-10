const VIDEO_EXTENSIONS = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv", ".webm"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"];

module.exports.isVideoOrImage = (filename) => {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (VIDEO_EXTENSIONS.includes(ext)) return true;
  if (IMAGE_EXTENSIONS.includes(ext)) return false;
  return false;
};
