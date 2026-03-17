const stripTrailingSlash = (value) =>
  value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;

export const getPublicBasePath = (publicUrl = process.env.PUBLIC_URL || "") => {
  if (!publicUrl) {
    return "/";
  }

  try {
    const pathname = new URL(publicUrl, "https://example.com").pathname;
    return stripTrailingSlash(pathname || "/") || "/";
  } catch {
    const pathname = publicUrl.replace(/^https?:\/\/[^/]+/i, "") || "/";
    const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return stripTrailingSlash(withLeadingSlash) || "/";
  }
};

export const getRuntimeBasePath = ({
  env = process.env.NODE_ENV,
  publicUrl = process.env.PUBLIC_URL || ""
} = {}) => {
  if (env !== "production") {
    return "/";
  }

  return getPublicBasePath(publicUrl);
};

export const getRouterBasename = () => {
  const basePath = getRuntimeBasePath();
  return basePath === "/" ? undefined : basePath;
};

export const buildPublicPortfolioUrl = (slug, origin = window.location.origin) => {
  const basePath = getRuntimeBasePath();
  const normalizedOrigin = origin.replace(/\/$/, "");
  const routePath = `${basePath === "/" ? "" : basePath}/p/${slug}`;

  return `${normalizedOrigin}${routePath}`;
};
