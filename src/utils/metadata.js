const DEFAULT_METADATA = {
  title: "BuildFolio",
  description: "Build and publish a recruiter-ready portfolio and resume.",
  image: `${process.env.PUBLIC_URL || ""}/logo.png`
};

const upsertMetaTag = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLinkTag = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

export const applyPublicPageMetadata = ({
  title = DEFAULT_METADATA.title,
  description = DEFAULT_METADATA.description,
  image = DEFAULT_METADATA.image,
  url = window.location.href
} = {}) => {
  document.title = title;

  upsertMetaTag("name", "description", description);
  upsertMetaTag("property", "og:title", title);
  upsertMetaTag("property", "og:description", description);
  upsertMetaTag("property", "og:type", "website");
  upsertMetaTag("property", "og:url", url);
  upsertMetaTag("property", "og:image", image);
  upsertMetaTag("name", "twitter:card", "summary_large_image");
  upsertMetaTag("name", "twitter:title", title);
  upsertMetaTag("name", "twitter:description", description);
  upsertMetaTag("name", "twitter:image", image);
  upsertLinkTag("canonical", url);
};

export const resetDefaultMetadata = () => {
  applyPublicPageMetadata({
    title: DEFAULT_METADATA.title,
    description: DEFAULT_METADATA.description,
    image: DEFAULT_METADATA.image,
    url: window.location.href
  });
};
