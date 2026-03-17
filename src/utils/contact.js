export const DEFAULT_CONTACT = Object.freeze({
  phone: "",
  email: "",
  github: "",
  linkedin: ""
});

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

export const normalizeExternalUrl = (value) => {
  const trimmedValue = normalizeText(value);
  if (!trimmedValue) return "";

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const parsedUrl = new URL(withProtocol);

    if (parsedUrl.protocol !== "https:") {
      return "";
    }

    return parsedUrl.toString();
  } catch {
    return "";
  }
};

export const isValidExternalUrlInput = (value) => {
  const trimmedValue = normalizeText(value);
  return !trimmedValue || Boolean(normalizeExternalUrl(trimmedValue));
};

export const normalizeContactInfo = (contact = {}) => ({
  ...DEFAULT_CONTACT,
  ...contact,
  phone: normalizeText(contact.phone),
  email: normalizeText(contact.email),
  github: normalizeExternalUrl(contact.github),
  linkedin: normalizeExternalUrl(contact.linkedin)
});
