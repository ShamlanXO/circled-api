const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateName = (name) => {
  return name && name.length >= 2;
};
const validatePhone = (password) => {
  return password.length >= 6;
};

const isVideo = (url) => {
  let nurl = url.toLowerCase();
  if (
    nurl.includes("mp4") ||
    nurl.includes("3gp") ||
    nurl.includes("avchd") ||
    nurl.includes("avi") ||
    nurl.includes("flv") ||
    nurl.includes("mkv") ||
    nurl.includes("mov") ||
    nurl.includes("webm")
  ) {
    return true;
  }
};

export { validateEmail, validatePassword, validateName, validatePhone, isVideo };